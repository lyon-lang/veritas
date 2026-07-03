import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { UserModel } from '@/lib/models';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

// POST - Handle Stripe webhooks
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle specific event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          UserModel.updatePlan(userId, plan);
          console.log(`User ${userId} upgraded to ${plan}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          // Determine plan from subscription items
          const priceId = subscription.items.data[0]?.price.id;
          let plan = 'free';
          if (priceId === process.env.STRIPE_PRICE_PRO) {
            plan = 'pro';
          } else if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) {
            plan = 'enterprise';
          }

          if (subscription.status === 'active') {
            UserModel.updatePlan(userId, plan);
          } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
            UserModel.updatePlan(userId, 'free');
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          UserModel.updatePlan(userId, 'free');
          console.log(`User ${userId} subscription cancelled, downgraded to free`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = invoice.metadata?.userId;

        if (userId) {
          // Could send notification email here
          console.log(`Payment failed for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
