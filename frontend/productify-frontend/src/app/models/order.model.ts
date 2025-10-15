export interface OrderItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface UpdateOrderRequest {
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface OrderFilter {
  status?: 'pending' | 'confirmed' | 'cancelled';
  sortBy?: 'createdAt' | 'totalAmount' | 'id';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  filter: OrderFilter;
}

export interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}
