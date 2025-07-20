
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
// Import updateSubmissionStatus conditionally to avoid build errors
let updateSubmissionStatus: any;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  // Dynamically import updateSubmissionStatus to avoid build errors
  try {
    const { updateSubmissionStatus: importedFunction } = await import('@/services/submissionService');
    updateSubmissionStatus = importedFunction;
  } catch (error) {
    console.error('Failed to import submissionService:', error);
  }
  
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Payment was successful for session:', session.id);
      
      const submissionId = session.metadata?.submissionId;
      if (submissionId) {
        try {
            // Update submission status from 'pending_payment' to 'paid'
            if (updateSubmissionStatus) {
              await updateSubmissionStatus(submissionId, 'paid');
              console.log(`Successfully updated submission ${submissionId} to paid.`);
            } else {
              console.log(`Function not available to update submission ${submissionId}.`);
            }
        } catch (error) {
            console.error(`Failed to update submission status for ${submissionId}:`, error);
            // Optionally, handle this error, e.g., send a notification to an admin
        }
      } else {
        console.error('Checkout session completed without a submissionId in metadata.');
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}
