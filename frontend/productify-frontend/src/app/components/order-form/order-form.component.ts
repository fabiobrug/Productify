import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, Observable } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { CartItem, CartState } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  products$: Observable<Product[]>;
  cartState$: Observable<CartState>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  
  selectedProductId: number | null = null;
  quantity: number = 1;
  isSubmitting = false;

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {
    this.products$ = this.productService.filteredProducts$;
    this.cartState$ = this.orderService.cartState$;
    this.loading$ = this.productService.loading$;
    this.error$ = this.productService.error$;
  }

  ngOnInit(): void {
    // Load products if not already loaded
    this.productService.refreshProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onProductSelect(): void {
    if (this.selectedProductId && this.quantity > 0) {
      this.addToCart();
    }
  }

  addToCart(): void {
    if (!this.selectedProductId || this.quantity <= 0) {
      this.notificationService.error('Erro', 'Selecione um produto e quantidade válida');
      return;
    }

    // Find the selected product
    this.productService.getProduct(this.selectedProductId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          this.orderService.addToCart(
            product.id,
            product.name,
            product.price,
            this.quantity
          );
          this.notificationService.success('Sucesso', `${product.name} adicionado ao carrinho!`);
          this.resetForm();
        },
        error: (error) => {
          this.notificationService.error('Erro', 'Erro ao buscar produto: ' + error.message);
        }
      });
  }

  updateCartItemQuantity(productId: number, quantity: number): void {
    this.orderService.updateCartItemQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.orderService.removeFromCart(productId);
    this.notificationService.success('Sucesso', 'Item removido do carrinho');
  }

  clearCart(): void {
    this.orderService.clearCart();
    this.notificationService.success('Sucesso', 'Carrinho limpo');
  }

  confirmOrder(): void {
    this.cartState$.pipe(takeUntil(this.destroy$)).subscribe(cartState => {
      if (cartState.items.length === 0) {
        this.notificationService.error('Erro', 'Adicione pelo menos um item ao carrinho');
        return;
      }

      this.isSubmitting = true;
      const orderData = {
        items: cartState.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      this.orderService.createOrder(orderData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (order) => {
            this.notificationService.success('Sucesso', `Pedido #${order.id} criado com sucesso!`);
            this.isSubmitting = false;
          },
          error: (error) => {
            this.notificationService.error('Erro', 'Erro ao criar pedido: ' + error.message);
            this.isSubmitting = false;
          }
        });
    });
  }

  private resetForm(): void {
    this.selectedProductId = null;
    this.quantity = 1;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  getProductById(products: Product[], productId: number): Product | undefined {
    return products.find(p => p.id === productId);
  }
}
