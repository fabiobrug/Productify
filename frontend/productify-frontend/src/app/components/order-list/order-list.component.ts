import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, Observable } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { Order, OrderFilter } from '../../models/order.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  orders$: Observable<Order[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  orderCount$: Observable<number>;
  
  currentFilter: OrderFilter = {};
  statusFilter: 'all' | 'pending' | 'confirmed' | 'cancelled' = 'all';
  sortBy: 'createdAt' | 'totalAmount' | 'id' = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {
    this.orders$ = this.orderService.filteredOrders$;
    this.loading$ = this.orderService.loading$;
    this.error$ = this.orderService.error$;
    this.orderCount$ = this.orderService.getFilteredOrderCount();
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onStatusFilterChange(): void {
    this.currentFilter = {
      ...this.currentFilter,
      status: this.statusFilter === 'all' ? undefined : this.statusFilter
    };
    this.applyFilters();
  }

  onSortChange(): void {
    this.currentFilter = {
      ...this.currentFilter,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };
    this.applyFilters();
  }

  private applyFilters(): void {
    this.orderService.setFilter(this.currentFilter);
  }

  confirmOrder(orderId: number): void {
    this.orderService.confirmOrder(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Sucesso', 'Pedido confirmado com sucesso!');
        },
        error: (error) => {
          this.notificationService.error('Erro', 'Erro ao confirmar pedido: ' + error.message);
        }
      });
  }

  cancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Sucesso', 'Pedido cancelado com sucesso!');
        },
        error: (error) => {
          this.notificationService.error('Erro', 'Erro ao cancelar pedido: ' + error.message);
        }
      });
  }

  deleteOrder(orderId: number): void {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      this.orderService.deleteOrder(orderId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success('Sucesso', 'Pedido excluído com sucesso!');
          },
          error: (error) => {
            this.notificationService.error('Erro', 'Erro ao excluir pedido: ' + error.message);
          }
        });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }
}
