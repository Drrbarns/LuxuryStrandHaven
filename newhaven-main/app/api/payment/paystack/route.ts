import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * Initialize a Paystack transaction.
 * Amount in GHS is sent in pesewas (multiply by 100).
 */
export async function POST(req: Request) {
  try {
    const clientId = getClientIdentifier(req);
    const rateLimitResult = checkRateLimit(`payment:${clientId}`, RATE_LIMITS.payment);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetIn.toString(),
          },
        }
      );
    }

    const body = await req.json();
    const { orderId, amount, customerEmail } = body;

    if (!orderId || amount == null) {
      return NextResponse.json({ success: false, message: 'Missing orderId or amount' }, { status: 400 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error('Missing PAYSTACK_SECRET_KEY');
      return NextResponse.json({ success: false, message: 'Payment gateway configuration error' }, { status: 500 });
    }

    const requestUrl = new URL(req.url);
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin).replace(/\/+$/, '');

    // Paystack amount in pesewas (GHS subunit): 1 GHS = 100 pesewas
    const amountInPesewas = Math.round(Number(amount) * 100);
    if (amountInPesewas < 10) {
      return NextResponse.json({ success: false, message: 'Amount too small (min GH₵0.10)' }, { status: 400 });
    }

    // Unique reference for this payment attempt (allow retries)
    const reference = `${orderId}-R${Date.now()}`;

    const payload = {
      email: customerEmail || 'customer@example.com',
      amount: amountInPesewas,
      currency: 'GHS',
      reference,
      callback_url: `${baseUrl}/order-success?order=${encodeURIComponent(orderId)}&payment_success=true`,
      metadata: {
        order_number: orderId,
        custom_fields: [
          { display_name: 'Order', variable_name: 'order_number', value: orderId },
        ],
      },
    };

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.status && result.data?.authorization_url) {
      return NextResponse.json({
        success: true,
        url: result.data.authorization_url,
        reference: result.data.reference,
        access_code: result.data.access_code,
      });
    }

    return NextResponse.json(
      { success: false, message: result.message || 'Failed to initialize Paystack payment' },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Paystack API Error:', error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
