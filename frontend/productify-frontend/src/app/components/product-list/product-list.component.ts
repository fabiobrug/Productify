import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';
import { Product, ProductFilter } from '../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FilterSectionComponent } from '../filter-section/filter-section.component';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, ProductCardComponent, FilterSectionComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Observables from service
  products$!: Observable<Product[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  filter$!: Observable<ProductFilter>;
  productCount$!: Observable<number>;

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService
  ) {
    // Initialize observables after service injection
    this.products$ = this.productService.filteredProducts$;
    this.loading$ = this.productService.loading$;
    this.error$ = this.productService.error$;
    this.filter$ = this.productService.filter$;
    this.productCount$ = this.productService.getFilteredProductCount();
  }

  ngOnInit(): void {
    // Subscribe to error stream to show notifications
    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.notificationService.error('Error', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChange(filter: Partial<ProductFilter>): void {
    this.productService.setFilter(filter);
  }

  onClearFilters(): void {
    this.productService.clearFilter();
  }

  onDeleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productService.deleteProduct(product.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success('Success', 'Product deleted successfully');
          },
          error: (error) => {
            this.notificationService.error('Error', 'Failed to delete product');
          }
        });
    }
  }

  onRefresh(): void {
    this.productService.refreshProducts();
    this.notificationService.info('Refreshing', 'Loading products...');
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
