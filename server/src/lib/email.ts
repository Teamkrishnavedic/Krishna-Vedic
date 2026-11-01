import { Resend } from 'resend';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const ADMIN_EMAIL = () => process.env.ADMIN_NOTIFICATION_EMAIL || 'krishnavedic001@gmail.com';
const SENDER_EMAIL = () => process.env.EMAIL_FROM || 'Krishna Vedic <onboarding@resend.dev>';
const CLIENT_URL = () => process.env.CLIENT_URL || 'https://krishnavedic.com';

export interface OrderItemEmailData {
  productName: string;
  variantName: string;
  quantity: number;
  priceSnapshot: number; // in paise
  subtotal: number; // in paise
}

export interface OrderEmailData {
  id: string;
  orderNumber: string;
  total: number; // in paise
  subtotal: number;
  shippingCharge: number;
  discountAmount?: number;
  paymentMethod: string;
  shippingName: string;
  shippingPhone: string;
  shippingLine1: string;
  shippingLine2?: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  deliveryInstructions?: string | null;
  items: OrderItemEmailData[];
  createdAt?: Date;
}

const formatRupees = (paise: number) => {
  return '₹' + (paise / 100).toLocaleString('en-IN');
};

/**
 * Send an email notification to the store owner / admin when a new customer order is placed.
 */
export async function sendAdminOrderNotification(order: OrderEmailData): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.warn('[Email] RESEND_API_KEY is not configured. Skipping admin order notification.');
    return false;
  }

  const adminOrderUrl = `${CLIENT_URL()}/admin/orders/${order.id}`;
  const targetEmail = ADMIN_EMAIL();
  const fromEmail = SENDER_EMAIL();
  const paymentBadge = order.paymentMethod === 'COD' ? '💵 Cash on Delivery (COD)' : '💳 Paid Online';

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #edece2;">
        <td style="padding: 12px 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="font-weight: 600; color: #2d2a26; font-size: 14px;">${item.productName}</div>
          <div style="color: #7d7567; font-size: 12px; margin-top: 2px;">Pack: ${item.variantName} • Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #6e3418; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          ${formatRupees(item.subtotal || item.priceSnapshot * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Order #${order.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f6f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #2d2a26;">
  <div style="max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e5e2da; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    
    <!-- Top Vedic Header -->
    <div style="background-color: #6e3418; padding: 26px 30px; text-align: center; color: #fafbf5;">
      <h1 style="margin: 0; font-family: Georgia, serif; font-size: 24px; letter-spacing: 0.5px;">Krishna Vedic</h1>
      <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.85; text-transform: uppercase; letter-spacing: 1.5px;">Pure Wood-Pressed Oils &amp; Authentic Spices</p>
    </div>

    <!-- Alert Banner -->
    <div style="background-color: #3f674f; color: #ffffff; padding: 14px 30px; text-align: center; font-weight: 600; font-size: 14px;">
      🌿 New Customer Order Received!
    </div>

    <div style="padding: 30px;">
      <!-- Order Quick Stats -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #fafbf5; border-radius: 12px; border: 1px solid #edece2;">
        <tr>
          <td style="padding: 14px 18px;">
            <div style="font-size: 11px; text-transform: uppercase; color: #7d7567; font-weight: 700; letter-spacing: 0.5px;">Order Number</div>
            <div style="font-size: 16px; font-weight: 700; color: #6e3418; font-family: monospace; margin-top: 2px;">${order.orderNumber}</div>
          </td>
          <td style="padding: 14px 18px; text-align: right;">
            <div style="font-size: 11px; text-transform: uppercase; color: #7d7567; font-weight: 700; letter-spacing: 0.5px;">Grand Total</div>
            <div style="font-size: 20px; font-weight: 700; color: #2d2a26; font-family: Georgia, serif; margin-top: 2px;">${formatRupees(order.total)}</div>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px 18px; border-top: 1px solid #edece2; font-size: 12px; color: #52443c;">
            Payment: <strong>${paymentBadge}</strong>
          </td>
        </tr>
      </table>

      <!-- Customer Details Card -->
      <div style="background: #ffffff; border: 1px solid #edece2; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #6e3418; font-family: Georgia, serif; letter-spacing: 0.5px;">Delivery &amp; Customer Information</h3>
        <div style="font-size: 14px; font-weight: 700; color: #2d2a26; margin-bottom: 4px;">${order.shippingName}</div>
        <div style="font-size: 13px; color: #52443c; line-height: 1.5;">
          ${order.shippingLine1}${order.shippingLine2 ? ', ' + order.shippingLine2 : ''}<br>
          ${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}
        </div>
        <div style="margin-top: 10px; font-size: 13px; color: #2d2a26;">
          📞 <strong>Phone:</strong> <a href="tel:${order.shippingPhone}" style="color: #6e3418; text-decoration: none; font-weight: 600;">${order.shippingPhone}</a>
        </div>
        ${order.deliveryInstructions ? `<div style="margin-top: 8px; font-size: 12px; color: #7d7567; font-style: italic;">Note: ${order.deliveryInstructions}</div>` : ''}
      </div>

      <!-- Items Ordered -->
      <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #6e3418; font-family: Georgia, serif; letter-spacing: 0.5px;">Items Ordered (${order.items.length})</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        ${itemsHtml}
      </table>

      <!-- Financials Summary -->
      <table style="width: 100%; font-size: 13px; color: #52443c; line-height: 1.8; margin-bottom: 28px;">
        <tr>
          <td>Subtotal:</td>
          <td style="text-align: right; font-weight: 600;">${formatRupees(order.subtotal)}</td>
        </tr>
        ${order.discountAmount && order.discountAmount > 0 ? `<tr><td style="color: #3f674f;">Discount:</td><td style="text-align: right; color: #3f674f; font-weight: 600;">-${formatRupees(order.discountAmount)}</td></tr>` : ''}
        <tr>
          <td>Shipping Charge:</td>
          <td style="text-align: right; font-weight: 600;">${order.shippingCharge > 0 ? formatRupees(order.shippingCharge) : 'FREE'}</td>
        </tr>
        <tr style="border-top: 1px solid #edece2; font-size: 16px; font-weight: 700; color: #6e3418;">
          <td style="padding-top: 8px; font-family: Georgia, serif;">Total Amount:</td>
          <td style="text-align: right; padding-top: 8px; font-family: Georgia, serif;">${formatRupees(order.total)}</td>
        </tr>
      </table>

      <!-- Call to Action Button -->
      <div style="text-align: center; margin-top: 10px;">
        <a href="${adminOrderUrl}" style="background-color: #6e3418; color: #fafbf5; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
          Open Order in Admin Panel →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #fafbf5; padding: 18px 30px; text-align: center; font-size: 11px; color: #7d7567; border-top: 1px solid #edece2;">
      Krishna Vedic Store Order Dispatch System • Vedic Heritage Complex, Industrial Area Phase II, Jaipur, Rajasthan
    </div>
  </div>
</body>
</html>
  `;

  try {
    const response = await resend.emails.send({
      from: fromEmail,
      to: [targetEmail],
      subject: `🌿 New Order #${order.orderNumber} received (${formatRupees(order.total)})`,
      html: htmlContent,
    });

    if (response.error) {
      console.error('[Email] Resend delivery error:', response.error);
      return false;
    }

    console.log(`[Email] ✅ Order alert email successfully sent to ${targetEmail} (Email ID: ${response.data?.id})`);
    return true;
  } catch (err: any) {
    console.error('[Email] Failed to send order notification email:', err?.message || err);
    return false;
  }
}
