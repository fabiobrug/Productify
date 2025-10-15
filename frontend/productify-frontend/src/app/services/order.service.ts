import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, throwError } from 'rxjs';
import { map, catchError, tap, debounceTime, distinctUntilChanged, shareReplay } from 'rxjs/operators';
import { Order, CreateOrderRequest, UpdateOrderRequest, OrderFilter, OrderState, CartItem, CartState } from '../models/order.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = 'http://localhost:3000/orders';
  
  // State management with BehaviorSubjects
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private filterSubject = new BehaviorSubject<OrderFilter>({});

  // Cart state management
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  // Public observables
  public readonly orders$ = this.ordersSubject.asObservable();
  public readonly loading$ = this.loadingSubject.asObservable();
  public readonly error$ = this.errorSubject.asObservable();
  public readonly filter$ = this.filterSubject.asObservable();
  public readonly cart$ = this.cartSubject.asObservable();

  // Combined state observable
  public readonly state$: Observable<OrderState> = combineLatest([
    this.orders$,
    this.loading$,
    this.error$,
    this.filter$
  ]).pipe(
    map(([orders, loading, error, filter]) => ({
      orders,
      loading,
      error,
      filter
    })),
    shareReplay(1)
  );

  // Cart state observable
  public readonly cartState$: Observable<CartState> = this.cart$.pipe(
    map(items => ({
      items,
      totalAmount: items.reduce((total, item) => total + (item.productPrice * item.quantity), 0)
    })),
    shareReplay(1)
  );

  // Filtered orders with reactive filtering
  public readonly filteredOrders$ = combineLatest([
    this.orders$,
    this.filterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev) === JSON.stringify(curr)
      )
    )
  ]).pipe(
    map(([orders, filter]) => this.applyFilters(orders, filter)),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {
    // Load orders on service initialization
    this.loadOrders();
  }

  // CRUD Operations
  loadOrders(): void {
    this.setLoading(true);
    this.clearError();
    
    this.http.get<Order[]>(this.API_URL)
      .pipe(
        tap(orders => {
          this.ordersSubject.next(orders);
          this.setLoading(false);
        }),
        catchError(error => this.handleError(error))
      )
      .subscribe();
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  createOrder(order: CreateOrderRequest): Observable<Order> {
    this.setLoading(true);
    this.clearError();
    
    return this.http.post<Order>(this.API_URL, order)
      .pipe(
        tap(newOrder => {
          const currentOrders = this.ordersSubject.value;
          this.ordersSubject.next([newOrder, ...currentOrders]);
          this.setLoading(false);
          // Clear cart after successful order creation
          this.clearCart();
        }),
        catchError(error => this.handleError(error))
      );
  }

  updateOrder(id: number, order: UpdateOrderRequest): Observable<Order> {
    this.setLoading(true);
    this.clearError();
    
    return this.http.patch<Order>(`${this.API_URL}/${id}`, order)
      .pipe(
        tap(updatedOrder => {
          const currentOrders = this.ordersSubject.value;
          const index = currentOrders.findIndex(o => o.id === id);
          if (index !== -1) {
            currentOrders[index] = updatedOrder;
            this.ordersSubject.next([...currentOrders]);
          }
          this.setLoading(false);
        }),
        catchError(error => this.handleError(error))
      );
  }

  confirmOrder(id: number): Observable<Order> {
    return this.http.patch<Order>(`${this.API_URL}/${id}/confirm`, {})
      .pipe(
        tap(updatedOrder => {
          const currentOrders = this.ordersSubject.value;
          const index = currentOrders.findIndex(o => o.id === id);
          if (index !== -1) {
            currentOrders[index] = updatedOrder;
            this.ordersSubject.next([...currentOrders]);
          }
        }),
        catchError(error => this.handleError(error))
      );
  }

  cancelOrder(id: number): Observable<Order> {
    return this.http.patch<Order>(`${this.API_URL}/${id}/cancel`, {})
      .pipe(
        tap(updatedOrder => {
          const currentOrders = this.ordersSubject.value;
          const index = currentOrders.findIndex(o => o.id === id);
          if (index !== -1) {
            currentOrders[index] = updatedOrder;
            this.ordersSubject.next([...currentOrders]);
          }
        }),
        catchError(error => this.handleError(error))
      );
  }

  deleteOrder(id: number): Observable<void> {
    this.setLoading(true);
    this.clearError();
    
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(
        tap(() => {
          const currentOrders = this.ordersSubject.value;
          const filteredOrders = currentOrders.filter(o => o.id !== id);
          this.ordersSubject.next(filteredOrders);
          this.setLoading(false);
        }),
        catchError(error => this.handleError(error))
      );
  }

  // Cart management
  addToCart(productId: number, productName: string, productPrice: number, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      // Update existing item
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += quantity;
      this.cartSubject.next(updatedCart);
    } else {
      // Add new item
      const newItem: CartItem = {
        productId,
        productName,
        productPrice,
        quantity
      };
      this.cartSubject.next([...currentCart, newItem]);
    }
  }

  updateCartItemQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    this.cartSubject.next(updatedCart);
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    const filteredCart = currentCart.filter(item => item.productId !== productId);
    this.cartSubject.next(filteredCart);
  }

  clearCart(): void {
    this.cartSubject.next([]);
  }

  // Filter management
  setFilter(filter: Partial<OrderFilter>): void {
    const currentFilter = this.filterSubject.value;
    this.filterSubject.next({ ...currentFilter, ...filter });
  }

  clearFilter(): void {
    this.filterSubject.next({});
  }

  // Private helper methods
  private applyFilters(orders: Order[], filter: OrderFilter): Order[] {
    let filteredOrders = [...orders];

    // Status filter
    if (filter.status) {
      filteredOrders = filteredOrders.filter(order => order.status === filter.status);
    }

    // Sort
    if (filter.sortBy) {
      filteredOrders.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filter.sortBy) {
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'totalAmount':
            aValue = a.totalAmount;
            bValue = b.totalAmount;
            break;
          case 'id':
            aValue = a.id;
            bValue = b.id;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return filter.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return filter.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return filteredOrders;
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private clearError(): void {
    this.errorSubject.next(null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error('OrderService Error:', error);
    this.errorSubject.next(errorMessage);
    this.setLoading(false);
    
    return throwError(() => error);
  }

  // Utility methods
  getOrderCount(): Observable<number> {
    return this.orders$.pipe(map(orders => orders.length));
  }

  getFilteredOrderCount(): Observable<number> {
    return this.filteredOrders$.pipe(map(orders => orders.length));
  }

  refreshOrders(): void {
    this.loadOrders();
  }
}
