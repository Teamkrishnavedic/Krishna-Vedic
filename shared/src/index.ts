import { z } from 'zod';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// ─── Address ─────────────────────────────────────────────────────────────────

export const addressSchema = z.object({
  label: z.string().max(50).optional(),
  fullName: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  line1: z.string().min(5).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

// ─── Category ────────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// ─── Product ─────────────────────────────────────────────────────────────────

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  shortDescription: z.string().max(500).optional(),
  sku: z.string().min(1).max(100),
  categoryId: z.string(),
  ingredients: z.string().max(2000).optional(),
  storageInstructions: z.string().max(500).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.boolean().default(false),
  weight: z.number().positive().optional(),
  weightUnit: z.enum(['g', 'kg', 'ml', 'l']).optional(),
  taxRate: z.number().min(0).max(100).default(0),
  tags: z.array(z.string()).default([]),
});

export type ProductInput = z.infer<typeof productSchema>;

// ─── Product Variant ─────────────────────────────────────────────────────────

export const variantSchema = z.object({
  productId: z.string(),
  name: z.string().min(1).max(100),
  sku: z.string().min(1).max(100),
  price: z.number().int().positive(), // stored in paise (₹ × 100)
  compareAtPrice: z.number().int().positive().optional(), // original/sale-from price
  stock: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  weight: z.number().positive().optional(),
  weightUnit: z.enum(['g', 'kg', 'ml', 'l']).optional(),
  isDefault: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type VariantInput = z.infer<typeof variantSchema>;

// ─── Price Update ────────────────────────────────────────────────────────────

export const priceUpdateSchema = z.object({
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional(),
  reason: z.string().max(500).optional(),
});

export type PriceUpdateInput = z.infer<typeof priceUpdateSchema>;

// ─── Cart ────────────────────────────────────────────────────────────────────

export const addToCartSchema = z.object({
  variantId: z.string(),
  quantity: z.number().int().positive().max(100),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(100),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

// ─── Checkout ────────────────────────────────────────────────────────────────

export const checkoutSchema = z.object({
  addressId: z.string().optional(),
  newAddress: addressSchema.optional(),
  paymentMethod: z.enum(['COD', 'ONLINE']),
  deliveryInstructions: z.string().max(500).optional(),
  couponCode: z.string().max(50).optional(),
}).refine(data => data.addressId || data.newAddress, {
  message: 'Either addressId or newAddress is required',
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// ─── Coupon ──────────────────────────────────────────────────────────────────

export const couponSchema = z.object({
  code: z.string().min(3).max(50).toUpperCase(),
  description: z.string().max(500).optional(),
  discountType: z.enum(['PERCENTAGE', 'FLAT']),
  discountValue: z.number().int().positive(),
  minOrderValue: z.number().int().min(0).default(0),
  maxUses: z.number().int().positive().optional(),
  maxUsesPerUser: z.number().int().positive().default(1),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;

// ─── Order Status ────────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];

export const PAYMENT_STATUSES = [
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED',
  'PARTIALLY_REFUNDED',
] as const;

export type PaymentStatus = typeof PAYMENT_STATUSES[number];

// ─── Order Update (admin) ─────────────────────────────────────────────────────

export const orderStatusUpdateSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  note: z.string().max(500).optional(),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;

// ─── Shipping Rule ────────────────────────────────────────────────────────────

export const shippingRuleSchema = z.object({
  name: z.string().min(1).max(100),
  minOrderValue: z.number().int().min(0).default(0),
  maxOrderValue: z.number().int().positive().optional(),
  charge: z.number().int().min(0),
  estimatedDays: z.string().max(50).optional(),
  isActive: z.boolean().default(true),
});

export type ShippingRuleInput = z.infer<typeof shippingRuleSchema>;

// ─── Inventory Adjustment ─────────────────────────────────────────────────────

export const inventoryAdjustmentSchema = z.object({
  variantId: z.string(),
  quantity: z.number().int(),
  reason: z.string().min(1).max(500),
  type: z.enum(['RESTOCK', 'SALE', 'RETURN', 'DAMAGE', 'CORRECTION']),
});

export type InventoryAdjustmentInput = z.infer<typeof inventoryAdjustmentSchema>;

// ─── Pagination ───────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// ─── Money Helpers ────────────────────────────────────────────────────────────

/** Convert paise (integer) to rupees string: 4999 → "49.99" */
export const paiseToRupees = (paise: number): string =>
  (paise / 100).toFixed(2);

/** Format paise as Indian currency string: 4999 → "₹49.99" */
export const formatPrice = (paise: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paise / 100);
