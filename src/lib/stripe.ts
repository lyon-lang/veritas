import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
});

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: ['Basic trust scores', '5 verifications/day', 'Browser extension'],
    verificationsPerDay: 5,
  },
  consumer: {
    name: 'Consumer',
    price: 10,
    priceId: 'price_consumer', // Replace with actual Stripe price ID
    features: ['Detailed trust scores', 'Unlimited verifications', 'Browser extension', 'Mobile app'],
    verificationsPerDay: -1, // unlimited
  },
  professional: {
    name: 'Professional',
    price: 50,
    priceId: 'price_professional', // Replace with actual Stripe price ID
    features: ['Everything in Consumer', 'API access', 'Priority support', 'Custom reports'],
    verificationsPerDay: -1,
  },
  enterprise: {
    name: 'Enterprise',
    price: null, // custom
    priceId: 'price_enterprise', // Replace with actual Stripe price ID
    features: ['Everything in Professional', 'Custom integrations', 'Dedicated support', 'SLA'],
    verificationsPerDay: -1,
  },
};

export async function createCheckoutSession(
  priceId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    ...(customerId && { customer: customerId }),
  });

  return session;
}

export async function createCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  });

  return customer;
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return session;
}
