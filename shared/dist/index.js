"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPrice = exports.paiseToRupees = exports.paginationSchema = exports.inventoryAdjustmentSchema = exports.shippingRuleSchema = exports.orderStatusUpdateSchema = exports.PAYMENT_STATUSES = exports.ORDER_STATUSES = exports.couponSchema = exports.checkoutSchema = exports.updateCartItemSchema = exports.addToCartSchema = exports.priceUpdateSchema = exports.variantSchema = exports.productSchema = exports.categorySchema = exports.addressSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// ─── Auth ────────────────────────────────────────────────────────────────────
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    password: zod_1.z.string().min(8).max(128),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
// ─── Address ─────────────────────────────────────────────────────────────────
exports.addressSchema = zod_1.z.object({
    label: zod_1.z.string().max(50).optional(),
    fullName: zod_1.z.string().min(2).max(100),
    phone: zod_1.z.string().regex(/^[6-9]\d{9}$/),
    line1: zod_1.z.string().min(5).max(200),
    line2: zod_1.z.string().max(200).optional(),
    city: zod_1.z.string().min(2).max(100),
    state: zod_1.z.string().min(2).max(100),
    pincode: zod_1.z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
    isDefault: zod_1.z.boolean().default(false),
});
// ─── Category ────────────────────────────────────────────────────────────────
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    slug: zod_1.z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
    description: zod_1.z.string().max(500).optional(),
    imageUrl: zod_1.z.string().url().optional(),
    parentId: zod_1.z.string().optional(),
    sortOrder: zod_1.z.number().int().default(0),
});
// ─── Product ─────────────────────────────────────────────────────────────────
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    slug: zod_1.z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
    description: zod_1.z.string().max(5000).optional(),
    shortDescription: zod_1.z.string().max(500).optional(),
    sku: zod_1.z.string().min(1).max(100),
    categoryId: zod_1.z.string(),
    ingredients: zod_1.z.string().max(2000).optional(),
    storageInstructions: zod_1.z.string().max(500).optional(),
    status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    isFeatured: zod_1.z.boolean().default(false),
    weight: zod_1.z.number().positive().optional(),
    weightUnit: zod_1.z.enum(['g', 'kg', 'ml', 'l']).optional(),
    taxRate: zod_1.z.number().min(0).max(100).default(0),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
// ─── Product Variant ─────────────────────────────────────────────────────────
exports.variantSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    name: zod_1.z.string().min(1).max(100),
    sku: zod_1.z.string().min(1).max(100),
    price: zod_1.z.number().int().positive(), // stored in paise (₹ × 100)
    compareAtPrice: zod_1.z.number().int().positive().optional(), // original/sale-from price
    stock: zod_1.z.number().int().min(0).default(0),
    lowStockThreshold: zod_1.z.number().int().min(0).default(5),
    weight: zod_1.z.number().positive().optional(),
    weightUnit: zod_1.z.enum(['g', 'kg', 'ml', 'l']).optional(),
    isDefault: zod_1.z.boolean().default(false),
    sortOrder: zod_1.z.number().int().default(0),
});
// ─── Price Update ────────────────────────────────────────────────────────────
exports.priceUpdateSchema = zod_1.z.object({
    price: zod_1.z.number().int().positive(),
    compareAtPrice: zod_1.z.number().int().positive().optional(),
    reason: zod_1.z.string().max(500).optional(),
});
// ─── Cart ────────────────────────────────────────────────────────────────────
exports.addToCartSchema = zod_1.z.object({
    variantId: zod_1.z.string(),
    quantity: zod_1.z.number().int().positive().max(100),
});
exports.updateCartItemSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().min(0).max(100),
});
// ─── Checkout ────────────────────────────────────────────────────────────────
exports.checkoutSchema = zod_1.z.object({
    addressId: zod_1.z.string().optional(),
    newAddress: exports.addressSchema.optional(),
    paymentMethod: zod_1.z.enum(['COD', 'ONLINE']),
    deliveryInstructions: zod_1.z.string().max(500).optional(),
    couponCode: zod_1.z.string().max(50).optional(),
}).refine(data => data.addressId || data.newAddress, {
    message: 'Either addressId or newAddress is required',
});
// ─── Coupon ──────────────────────────────────────────────────────────────────
exports.couponSchema = zod_1.z.object({
    code: zod_1.z.string().min(3).max(50).toUpperCase(),
    description: zod_1.z.string().max(500).optional(),
    discountType: zod_1.z.enum(['PERCENTAGE', 'FLAT']),
    discountValue: zod_1.z.number().int().positive(),
    minOrderValue: zod_1.z.number().int().min(0).default(0),
    maxUses: zod_1.z.number().int().positive().optional(),
    maxUsesPerUser: zod_1.z.number().int().positive().default(1),
    startsAt: zod_1.z.string().datetime().optional(),
    expiresAt: zod_1.z.string().datetime().optional(),
    isActive: zod_1.z.boolean().default(true),
});
// ─── Order Status ────────────────────────────────────────────────────────────
exports.ORDER_STATUSES = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'RETURNED',
];
exports.PAYMENT_STATUSES = [
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED',
    'PARTIALLY_REFUNDED',
];
// ─── Order Update (admin) ─────────────────────────────────────────────────────
exports.orderStatusUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(exports.ORDER_STATUSES),
    note: zod_1.z.string().max(500).optional(),
});
// ─── Shipping Rule ────────────────────────────────────────────────────────────
exports.shippingRuleSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    minOrderValue: zod_1.z.number().int().min(0).default(0),
    maxOrderValue: zod_1.z.number().int().positive().optional(),
    charge: zod_1.z.number().int().min(0),
    estimatedDays: zod_1.z.string().max(50).optional(),
    isActive: zod_1.z.boolean().default(true),
});
// ─── Inventory Adjustment ─────────────────────────────────────────────────────
exports.inventoryAdjustmentSchema = zod_1.z.object({
    variantId: zod_1.z.string(),
    quantity: zod_1.z.number().int(),
    reason: zod_1.z.string().min(1).max(500),
    type: zod_1.z.enum(['RESTOCK', 'SALE', 'RETURN', 'DAMAGE', 'CORRECTION']),
});
// ─── Pagination ───────────────────────────────────────────────────────────────
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
});
// ─── Money Helpers ────────────────────────────────────────────────────────────
/** Convert paise (integer) to rupees string: 4999 → "49.99" */
const paiseToRupees = (paise) => (paise / 100).toFixed(2);
exports.paiseToRupees = paiseToRupees;
/** Format paise as Indian currency string: 4999 → "₹49.99" */
const formatPrice = (paise) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paise / 100);
exports.formatPrice = formatPrice;
//# sourceMappingURL=index.js.map