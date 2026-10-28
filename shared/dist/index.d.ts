import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    phone: string;
    password: string;
}, {
    name: string;
    email: string;
    phone: string;
    password: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const addressSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    fullName: z.ZodString;
    phone: z.ZodString;
    line1: z.ZodString;
    line2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    pincode: z.ZodString;
    isDefault: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    fullName: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
    label?: string | undefined;
    line2?: string | undefined;
}, {
    phone: string;
    fullName: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
    label?: string | undefined;
    line2?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export type AddressInput = z.infer<typeof addressSchema>;
export declare const categorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    sortOrder: number;
    description?: string | undefined;
    imageUrl?: string | undefined;
    parentId?: string | undefined;
}, {
    name: string;
    slug: string;
    description?: string | undefined;
    imageUrl?: string | undefined;
    parentId?: string | undefined;
    sortOrder?: number | undefined;
}>;
export type CategoryInput = z.infer<typeof categorySchema>;
export declare const productSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    shortDescription: z.ZodOptional<z.ZodString>;
    sku: z.ZodString;
    categoryId: z.ZodString;
    ingredients: z.ZodOptional<z.ZodString>;
    storageInstructions: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["DRAFT", "PUBLISHED", "ARCHIVED"]>>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    weight: z.ZodOptional<z.ZodNumber>;
    weightUnit: z.ZodOptional<z.ZodEnum<["g", "kg", "ml", "l"]>>;
    taxRate: z.ZodDefault<z.ZodNumber>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    slug: string;
    sku: string;
    categoryId: string;
    isFeatured: boolean;
    taxRate: number;
    tags: string[];
    description?: string | undefined;
    shortDescription?: string | undefined;
    ingredients?: string | undefined;
    storageInstructions?: string | undefined;
    weight?: number | undefined;
    weightUnit?: "g" | "kg" | "ml" | "l" | undefined;
}, {
    name: string;
    slug: string;
    sku: string;
    categoryId: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined;
    description?: string | undefined;
    shortDescription?: string | undefined;
    ingredients?: string | undefined;
    storageInstructions?: string | undefined;
    isFeatured?: boolean | undefined;
    weight?: number | undefined;
    weightUnit?: "g" | "kg" | "ml" | "l" | undefined;
    taxRate?: number | undefined;
    tags?: string[] | undefined;
}>;
export type ProductInput = z.infer<typeof productSchema>;
export declare const variantSchema: z.ZodObject<{
    productId: z.ZodString;
    name: z.ZodString;
    sku: z.ZodString;
    price: z.ZodNumber;
    compareAtPrice: z.ZodOptional<z.ZodNumber>;
    stock: z.ZodDefault<z.ZodNumber>;
    lowStockThreshold: z.ZodDefault<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    weightUnit: z.ZodOptional<z.ZodEnum<["g", "kg", "ml", "l"]>>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isDefault: boolean;
    sortOrder: number;
    sku: string;
    productId: string;
    price: number;
    stock: number;
    lowStockThreshold: number;
    weight?: number | undefined;
    weightUnit?: "g" | "kg" | "ml" | "l" | undefined;
    compareAtPrice?: number | undefined;
}, {
    name: string;
    sku: string;
    productId: string;
    price: number;
    isDefault?: boolean | undefined;
    sortOrder?: number | undefined;
    weight?: number | undefined;
    weightUnit?: "g" | "kg" | "ml" | "l" | undefined;
    compareAtPrice?: number | undefined;
    stock?: number | undefined;
    lowStockThreshold?: number | undefined;
}>;
export type VariantInput = z.infer<typeof variantSchema>;
export declare const priceUpdateSchema: z.ZodObject<{
    price: z.ZodNumber;
    compareAtPrice: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    price: number;
    compareAtPrice?: number | undefined;
    reason?: string | undefined;
}, {
    price: number;
    compareAtPrice?: number | undefined;
    reason?: string | undefined;
}>;
export type PriceUpdateInput = z.infer<typeof priceUpdateSchema>;
export declare const addToCartSchema: z.ZodObject<{
    variantId: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    variantId: string;
    quantity: number;
}, {
    variantId: string;
    quantity: number;
}>;
export declare const updateCartItemSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
}, {
    quantity: number;
}>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export declare const checkoutSchema: z.ZodEffects<z.ZodObject<{
    addressId: z.ZodOptional<z.ZodString>;
    newAddress: z.ZodOptional<z.ZodObject<{
        label: z.ZodOptional<z.ZodString>;
        fullName: z.ZodString;
        phone: z.ZodString;
        line1: z.ZodString;
        line2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        state: z.ZodString;
        pincode: z.ZodString;
        isDefault: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        phone: string;
        fullName: string;
        line1: string;
        city: string;
        state: string;
        pincode: string;
        isDefault: boolean;
        label?: string | undefined;
        line2?: string | undefined;
    }, {
        phone: string;
        fullName: string;
        line1: string;
        city: string;
        state: string;
        pincode: string;
        label?: string | undefined;
        line2?: string | undefined;
        isDefault?: boolean | undefined;
    }>>;
    paymentMethod: z.ZodEnum<["COD", "ONLINE"]>;
    deliveryInstructions: z.ZodOptional<z.ZodString>;
    couponCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    paymentMethod: "COD" | "ONLINE";
    addressId?: string | undefined;
    newAddress?: {
        phone: string;
        fullName: string;
        line1: string;
        city: string;
        state: string;
        pincode: string;
        isDefault: boolean;
        label?: string | undefined;
        line2?: string | undefined;
    } | undefined;
    deliveryInstructions?: string | undefined;
    couponCode?: string | undefined;
}, {
    paymentMethod: "COD" | "ONLINE";
    addressId?: string | undefined;
    newAddress?: {
        phone: string;
        fullName: string;
        line1: string;
        city: string;
        state: string;
        pincode: string;
        label?: string | undefined;
        line2?: string | undefined;
        isDefault?: boolean | undefined;
    } | undefined;
    deliveryInstructions?: string | undefined;
    couponCode?: string | undefined;
}>, {
    paymentMethod: "COD" | "ONLINE";
    addressId?: string | undefined;
    newAddress?: {
        phone: string;
        fullName: string;
        line1: string;
        city: string;
        state: string;
        pincode: string;
        isDefault: boolean;
        label?: string | undefined;
        line2?: string | undefined;
    } | undefined;
    deliveryInstructions?: string | undefined;
    couponCode?: string | undefined;
}, {
    paymentMethod: "COD" | "ONLINE";
    addressId?: string | undefined;
    newAddress?: {
        phone: string;
        fullName: string;
        line1: string;
        city: string;
        state: string;
        pincode: string;
        label?: string | undefined;
        line2?: string | undefined;
        isDefault?: boolean | undefined;
    } | undefined;
    deliveryInstructions?: string | undefined;
    couponCode?: string | undefined;
}>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export declare const couponSchema: z.ZodObject<{
    code: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    discountType: z.ZodEnum<["PERCENTAGE", "FLAT"]>;
    discountValue: z.ZodNumber;
    minOrderValue: z.ZodDefault<z.ZodNumber>;
    maxUses: z.ZodOptional<z.ZodNumber>;
    maxUsesPerUser: z.ZodDefault<z.ZodNumber>;
    startsAt: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    code: string;
    discountType: "PERCENTAGE" | "FLAT";
    discountValue: number;
    minOrderValue: number;
    maxUsesPerUser: number;
    isActive: boolean;
    description?: string | undefined;
    maxUses?: number | undefined;
    startsAt?: string | undefined;
    expiresAt?: string | undefined;
}, {
    code: string;
    discountType: "PERCENTAGE" | "FLAT";
    discountValue: number;
    description?: string | undefined;
    minOrderValue?: number | undefined;
    maxUses?: number | undefined;
    maxUsesPerUser?: number | undefined;
    startsAt?: string | undefined;
    expiresAt?: string | undefined;
    isActive?: boolean | undefined;
}>;
export type CouponInput = z.infer<typeof couponSchema>;
export declare const ORDER_STATUSES: readonly ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];
export type OrderStatus = typeof ORDER_STATUSES[number];
export declare const PAYMENT_STATUSES: readonly ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"];
export type PaymentStatus = typeof PAYMENT_STATUSES[number];
export declare const orderStatusUpdateSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "CONFIRMED" | "PROCESSING" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
    note?: string | undefined;
}, {
    status: "PENDING" | "CONFIRMED" | "PROCESSING" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";
    note?: string | undefined;
}>;
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
export declare const shippingRuleSchema: z.ZodObject<{
    name: z.ZodString;
    minOrderValue: z.ZodDefault<z.ZodNumber>;
    maxOrderValue: z.ZodOptional<z.ZodNumber>;
    charge: z.ZodNumber;
    estimatedDays: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    minOrderValue: number;
    isActive: boolean;
    charge: number;
    maxOrderValue?: number | undefined;
    estimatedDays?: string | undefined;
}, {
    name: string;
    charge: number;
    minOrderValue?: number | undefined;
    isActive?: boolean | undefined;
    maxOrderValue?: number | undefined;
    estimatedDays?: string | undefined;
}>;
export type ShippingRuleInput = z.infer<typeof shippingRuleSchema>;
export declare const inventoryAdjustmentSchema: z.ZodObject<{
    variantId: z.ZodString;
    quantity: z.ZodNumber;
    reason: z.ZodString;
    type: z.ZodEnum<["RESTOCK", "SALE", "RETURN", "DAMAGE", "CORRECTION"]>;
}, "strip", z.ZodTypeAny, {
    type: "RESTOCK" | "SALE" | "RETURN" | "DAMAGE" | "CORRECTION";
    reason: string;
    variantId: string;
    quantity: number;
}, {
    type: "RESTOCK" | "SALE" | "RETURN" | "DAMAGE" | "CORRECTION";
    reason: string;
    variantId: string;
    quantity: number;
}>;
export type InventoryAdjustmentInput = z.infer<typeof inventoryAdjustmentSchema>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type PaginationInput = z.infer<typeof paginationSchema>;
/** Convert paise (integer) to rupees string: 4999 → "49.99" */
export declare const paiseToRupees: (paise: number) => string;
/** Format paise as Indian currency string: 4999 → "₹49.99" */
export declare const formatPrice: (paise: number) => string;
//# sourceMappingURL=index.d.ts.map