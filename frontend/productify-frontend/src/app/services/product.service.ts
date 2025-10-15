import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest, throwError, of } from 'rxjs';
import { map, catchError, tap, debounceTime, distinctUntilChanged, shareReplay, switchMap } from 'rxjs/operators';
import { Product, CreateProductRequest, UpdateProductRequest, ProductFilter, ProductState } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://localhost:3000/products';
  
  // State management with BehaviorSubjects
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private filterSubject = new BehaviorSubject<ProductFilter>({});

  // Public observables
  public readonly products$ = this.productsSubject.asObservable();
  public readonly loading$ = this.loadingSubject.asObservable();
  public readonly error$ = this.errorSubject.asObservable();
  public readonly filter$ = this.filterSubject.asObservable();

  // Combined state observable
  public readonly state$: Observable<ProductState> = combineLatest([
    this.products$,
    this.loading$,
    this.error$,
    this.filter$
  ]).pipe(
    map(([products, loading, error, filter]) => ({
      products,
      loading,
      error,
      filter
    })),
    shareReplay(1)
  );

  // Filtered products with reactive filtering
  public readonly filteredProducts$ = combineLatest([
    this.products$,
    this.filterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev) === JSON.stringify(curr)
      )
    )
  ]).pipe(
    map(([products, filter]) => this.applyFilters(products, filter)),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {
    // Load products on service initialization
    this.loadProducts();
  }

  // CRUD Operations
  loadProducts(): void {
    this.setLoading(true);
    this.clearError();
    
    this.http.get<Product[]>(this.API_URL)
      .pipe(
        tap(products => {
          this.productsSubject.next(products);
          this.setLoading(false);
        }),
        catchError(error => this.handleError(error))
      )
      .subscribe();
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  createProduct(product: CreateProductRequest): Observable<Product> {
    this.setLoading(true);
    this.clearError();
    
    return this.http.post<Product>(this.API_URL, product)
      .pipe(
        tap(newProduct => {
          const currentProducts = this.productsSubject.value;
          this.productsSubject.next([...currentProducts, newProduct]);
          this.setLoading(false);
        }),
        catchError(error => this.handleError(error))
      );
  }

  updateProduct(id: number, product: UpdateProductRequest): Observable<Product> {
    this.setLoading(true);
    this.clearError();
    
    return this.http.patch<Product>(`${this.API_URL}/${id}`, product)
      .pipe(
        tap(updatedProduct => {
          const currentProducts = this.productsSubject.value;
          const index = currentProducts.findIndex(p => p.id === id);
          if (index !== -1) {
            currentProducts[index] = updatedProduct;
            this.productsSubject.next([...currentProducts]);
          }
          this.setLoading(false);
        }),
        catchError(error => this.handleError(error))
      );
  }

  deleteProduct(id: number): Observable<void> {
    this.setLoading(true);
    this.clearError();
    
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(
        tap(() => {
          const currentProducts = this.productsSubject.value;
          const filteredProducts = currentProducts.filter(p => p.id !== id);
          this.productsSubject.next(filteredProducts);
          this.setLoading(false);
        }),
        catchError(error => this.handleError(error))
      );
  }

  // Filter management
  setFilter(filter: Partial<ProductFilter>): void {
    const currentFilter = this.filterSubject.value;
    this.filterSubject.next({ ...currentFilter, ...filter });
  }

  clearFilter(): void {
    this.filterSubject.next({});
  }

  // Private helper methods
  private applyFilters(products: Product[], filter: ProductFilter): Product[] {
    let filteredProducts = [...products];

    // Search filter
    if (filter.search && filter.search.trim()) {
      const searchTerm = filter.search.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Price range filter
    if (filter.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= filter.minPrice!);
    }
    if (filter.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= filter.maxPrice!);
    }

    // Sort - always apply sorting for consistent display
    const sortBy = filter.sortBy || 'id'; // Default to ID if no sort specified
    const sortOrder = filter.sortOrder || 'asc'; // Default to ascending
    
    filteredProducts.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = Number(a.price);
          bValue = Number(b.price);
          break;
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        default:
          return 0;
      }

      // Ensure we're comparing valid numbers
      if (isNaN(aValue) || isNaN(bValue)) {
        console.warn('Invalid number comparison:', { aValue, bValue, sortBy });
        return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'desc' ? 1 : -1;
      if (aValue > bValue) return sortOrder === 'desc' ? -1 : 1;
      return 0;
    });

    return filteredProducts;
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
    
    console.error('ProductService Error:', error);
    this.errorSubject.next(errorMessage);
    this.setLoading(false);
    
    return throwError(() => error);
  }

  // Utility methods
  getProductCount(): Observable<number> {
    return this.products$.pipe(map(products => products.length));
  }

  getFilteredProductCount(): Observable<number> {
    return this.filteredProducts$.pipe(map(products => products.length));
  }

  refreshProducts(): void {
    this.loadProducts();
  }
}
