
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const { submissionId, email, isAnonymous } = await req.json();

    if (!submissionId) {
        return new NextResponse('Bad Request: submissionId is required', { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'apple_pay', 'google_pay'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: { 
            name: '12-Season Color Analysis',
            description: 'A comprehensive analysis of your unique color palette.',
          },
          unit_amount: 7500, // £75.00 in pence
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/confirmation?session_id={CHECKOUT_SESSION_ID}&submission_id=${submissionId}${isAnonymous ? '&anonymous=true' : ''}${email ? `&email=${encodeURIComponent(email)}` : ''}`,
      cancel_url: `${origin}/questionnaire`,
      metadata: {
        submissionId: submissionId, // Pass the submissionId to Stripe
        email: email || '',
        isAnonymous: isAnonymous ? 'true' : 'false',
      },
    });
    
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
