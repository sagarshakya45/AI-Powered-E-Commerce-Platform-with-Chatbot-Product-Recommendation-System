import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PaymentService } from '@/services/paymentService';
import { corsHeaders, handleOptions } from '@/lib/cors';
import { requireEnv } from '@/utils/env';

const stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
  apiVersion: '2024-06-20' as any,
});

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature) throw new Error('Missing stripe signature');
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      requireEnv('STRIPE_WEBHOOK_SECRET')
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400, headers: corsHeaders });
  }

  try {
    await PaymentService.handleWebhook(event);
    return NextResponse.json({ received: true }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: corsHeaders });
  }
}
