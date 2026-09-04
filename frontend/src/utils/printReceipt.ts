import { formatCurrency } from './formatters';

export function printOrderReceipt(order: any) {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) return;

  const itemsHtml = (order.items || [])
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f1f5f9;">${item.product?.title || 'Product'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: bold;">${formatCurrency(item.totalPrice)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>AuraMart Order Receipt #${order.orderNumber}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 900; color: #4338ca; }
          .badge { background: #e0e7ff; color: #3730a3; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .card { background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
          th { background: #f1f5f9; padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
          .totals { width: 300px; margin-left: auto; font-size: 13px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
          .totals-row.final { font-size: 16px; font-weight: 900; border-top: 2px solid #0f172a; padding-top: 12px; margin-top: 8px; color: #4338ca; }
          .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 50px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">AuraMart ⚡</div>
            <p style="font-size: 12px; color: #64748b; margin-top: 4px;">Official Tax Invoice & Sales Receipt</p>
          </div>
          <div>
            <span class="badge">Status: ${order.status}</span>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <strong style="display: block; margin-bottom: 6px; color: #475569;">Order Details</strong>
            <p style="margin: 2px 0;"><strong>Order Number:</strong> #${order.orderNumber}</p>
            <p style="margin: 2px 0;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p style="margin: 2px 0;"><strong>Payment Method:</strong> Credit Card / Stripe</p>
          </div>
          <div class="card">
            <strong style="display: block; margin-bottom: 6px; color: #475569;">Shipping Destination</strong>
            <p style="margin: 2px 0;">${order.address?.fullName || 'Valued Customer'}</p>
            <p style="margin: 2px 0;">${order.address?.street || 'Main Street'}</p>
            <p style="margin: 2px 0;">${order.address?.city || ''}, ${order.address?.state || ''} ${order.address?.postalCode || ''}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal</span>
            <span>${formatCurrency(order.totalAmount || order.finalAmount)}</span>
          </div>
          ${
            order.discountAmount
              ? `<div class="totals-row" style="color: #e11d48;">
            <span>Discount</span>
            <span>-${formatCurrency(order.discountAmount)}</span>
          </div>`
              : ''
          }
          <div class="totals-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div class="totals-row final">
            <span>Grand Total</span>
            <span>${formatCurrency(order.finalAmount)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for shopping with AuraMart Inc. For support, visit https://auramart.example.com</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
