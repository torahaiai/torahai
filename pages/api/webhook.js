import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    await supabaseAdmin
      .from('profiles')
      .update({ subscription_status: 'active', stripe_customer_id: session.customer, is_subscriber: true })
      .eq('id', userId);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    await supabaseAdmin
      .from('profiles')
      .update({ subscription_status: 'inactive', is_subscriber: false })
      .eq('stripe_customer_id', subscription.customer);
  }

  res.status(200).json({ received: true });
}

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
