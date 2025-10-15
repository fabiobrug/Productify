import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, switchMap, of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';
import { Product, CreateProductRequest, UpdateProductRequest } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  isLoading = false;
  hasUnsavedChanges = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => {
          const id = params['id'];
          if (id) {
            this.isEditMode = true;
            this.productId = +id;
            return this.productService.getProduct(this.productId);
          }
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(product => {
        if (product) {
          this.populateForm(product);
        }
      });

    // Track form changes
    this.productForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.hasUnsavedChanges = true;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(0.01), Validators.max(999999.99)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  private populateForm(product: Product): void {
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      description: product.description
    });
    this.hasUnsavedChanges = false;
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.isLoading) {
      this.isLoading = true;
      const formValue = this.productForm.value;

      if (this.isEditMode && this.productId) {
        this.updateProduct(formValue);
      } else {
        this.createProduct(formValue);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createProduct(productData: CreateProductRequest): void {
    // Convert price to number if it's a string
    const processedData = {
      ...productData,
      price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price
    };

    this.productService.createProduct(processedData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          this.isLoading = false;
          this.hasUnsavedChanges = false;
          this.notificationService.success('Success', 'Product created successfully');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating product:', error);
          let errorMessage = 'Failed to create product';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'Unable to connect to server. Please check if the backend is running.';
          } else if (error.status === 400) {
            errorMessage = 'Invalid product data. Please check all fields.';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
          
          this.notificationService.error('Error', errorMessage);
        }
      });
  }

  private updateProduct(productData: UpdateProductRequest): void {
    if (!this.productId) return;

    // Convert price to number if it's a string
    const processedData = {
      ...productData,
      price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price
    };

    this.productService.updateProduct(this.productId, processedData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          this.isLoading = false;
          this.hasUnsavedChanges = false;
          this.notificationService.success('Success', 'Product updated successfully');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating product:', error);
          let errorMessage = 'Failed to update product';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'Unable to connect to server. Please check if the backend is running.';
          } else if (error.status === 400) {
            errorMessage = 'Invalid product data. Please check all fields.';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }
          
          this.notificationService.error('Error', errorMessage);
        }
      });
  }

  onCancel(): void {
    if (this.hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        this.router.navigate(['/products']);
      }
    } else {
      this.router.navigate(['/products']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${control.errors['maxlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${control.errors['max'].max}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Product Name',
      price: 'Price',
      description: 'Description'
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }
}
