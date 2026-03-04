import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * Create a Stripe Checkout Session and return the URL to redirect the customer.
 * Amount is in the store's currency (GHS or USD); Stripe expects smallest unit (pesewas/cents).
 */
export async function POST(req: Request) {
  try {
    const clientId = getClientIdentifier(req);
    const rateLimitResult = checkRateLimit(`payment:${clientId}`, RATE_LIMITS.payment);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': rateLimitResult.resetIn.toString() } }
      );
    }

    const body = await req.json();
    const { orderId, amount, customerEmail } = body;

    if (!orderId || amount == null) {
      return NextResponse.json({ success: false, message: 'Missing orderId or amount' }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('Missing STRIPE_SECRET_KEY');
      return NextResponse.json({ success: false, message: 'Payment gateway configuration error' }, { status: 500 });
    }

    const requestUrl = new URL(req.url);
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin).replace(/\/+$/, '');

    const currency = (process.env.STRIPE_CURRENCY || 'ghs').toLowerCase();
    const isGhs = currency === 'ghs';
    const amountInSmallestUnit = Math.round(Number(amount) * (isGhs ? 100 : 100)); // GHS: pesewas, USD: cents

    if (amountInSmallestUnit < (isGhs ? 10 : 50)) {
      return NextResponse.json({ success: false, message: isGhs ? 'Amount too small (min GH₵0.10)' : 'Amount too small (min $0.50)' }, { status: 400 });
    }

    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amountInSmallestUnit,
            product_data: {
              name: `Order ${orderId}`,
              description: `Payment for order ${orderId}`,
              metadata: { order_number: orderId },
            },
          },
        },
      ],
      customer_email: customerEmail || undefined,
      client_reference_id: orderId,
      success_url: `${baseUrl}/api/payment/stripe/success?session_id={CHECKOUT_SESSION_ID}&order=${encodeURIComponent(orderId)}`,
      cancel_url: `${baseUrl}/pay/${orderId}?canceled=1`,
      metadata: { order_number: orderId },
    });

    if (session.url) {
      return NextResponse.json({ success: true, url: session.url, sessionId: session.id });
    }

    return NextResponse.json({ success: false, message: 'Failed to create checkout session' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Stripe API Error:', error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
