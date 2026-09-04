import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2024-06-20' as any,
});

export class PaymentService {
  static async createCheckoutSession(orderId: string, email: string, amount: number) {
    let payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          orderId,
          amount,
          status: 'PENDING'
        }
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      client_reference_id: orderId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `AuraMart Order #${orderId.slice(0, 8)}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/orders?success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout?canceled=true`,
    });

    return session.url;
  }

  static async handleWebhook(event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id;
      const paymentIntentId = session.payment_intent as string;

      if (orderId) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { orderId },
            data: { status: 'PAID', stripePaymentIntentId: paymentIntentId }
          }),
          prisma.order.update({
            where: { id: orderId },
            data: { status: 'CONFIRMED' }
          })
        ]);
      }
    }
  }
}
