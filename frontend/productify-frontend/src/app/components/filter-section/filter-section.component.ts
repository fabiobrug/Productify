import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductFilter } from '../../models/product.model';

@Component({
  selector: 'app-filter-section',
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-section.component.html',
  styleUrl: './filter-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterSectionComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<Partial<ProductFilter>>();
  @Output() clearFilters = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Filter state
  searchTerm = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: 'name' | 'price' | 'id' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  showAdvancedFilters = false;

  // Sort options
  sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'id', label: 'Date Added' }
  ];

  ngOnInit(): void {
    // Debounce search input
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.emitFilterChange({ search: searchTerm });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  onMinPriceChange(minPrice: string): void {
    this.minPrice = minPrice ? parseFloat(minPrice) : null;
    this.emitPriceFilterChange();
  }

  onMaxPriceChange(maxPrice: string): void {
    this.maxPrice = maxPrice ? parseFloat(maxPrice) : null;
    this.emitPriceFilterChange();
  }

  private emitPriceFilterChange(): void {
    this.emitFilterChange({ 
      minPrice: this.minPrice ?? undefined,
      maxPrice: this.maxPrice ?? undefined
    });
  }

  onQuickPriceFilter(minPrice: string, maxPrice: string): void {
    this.minPrice = minPrice ? parseFloat(minPrice) : null;
    this.maxPrice = maxPrice ? parseFloat(maxPrice) : null;
    this.emitPriceFilterChange();
  }

  onSortChange(): void {
    this.emitFilterChange({ 
      sortBy: this.sortBy, 
      sortOrder: this.sortOrder 
    });
  }

  onToggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.emitFilterChange({ 
      sortBy: this.sortBy, 
      sortOrder: this.sortOrder 
    });
  }

  onClearFilters(): void {
    this.searchTerm = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    this.showAdvancedFilters = false;
    
    this.clearFilters.emit();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  hasActiveFilters(): boolean {
    return !!(
      this.searchTerm ||
      this.minPrice !== null ||
      this.maxPrice !== null ||
      this.sortBy !== 'name' ||
      this.sortOrder !== 'asc'
    );
  }

  private emitFilterChange(filter: Partial<ProductFilter>): void {
    this.filterChange.emit(filter);
  }
}
