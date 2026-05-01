export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  createdAt: string;
  role?: 'admin' | 'user';
}

export interface Address {
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address & { firstName: string; lastName: string; email: string; phone: string };
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedModel?: string;
}
