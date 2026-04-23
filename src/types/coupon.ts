export type CouponType = 'percent' | 'fixed' | 'free_shipping';

export interface Coupon {
  id: string;           // Firestore doc ID = code (uppercase)
  code: string;         // e.g. "WILLKOMMEN10"
  type: CouponType;
  value: number;        // % or € amount (0 for free_shipping)
  minOrderValue: number; // minimum cart total to apply
  maxUses: number;      // 0 = unlimited
  usedCount: number;
  maxUsesPerUser: number; // 0 = unlimited, 1 = one-time per user
  expiresAt: string | null; // ISO date or null
  onlyNewCustomers: boolean;
  category: string | null; // null = all categories
  active: boolean;
  description: string;  // admin note
  createdAt: string;
}

export interface CouponValidation {
  valid: boolean;
  coupon?: Coupon;
  discount?: number;    // calculated € discount
  error?: string;
}
