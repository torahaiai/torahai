import Stripe from 'stripe';
import pool from '../../lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

    await pool.query(
      `update users set subscription_status = 'active', stripe_customer_id = $1, is_subscriber = true where id = $2`,
      [session.customer, userId]
    );
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    await pool.query(
      `update users set subscription_status = 'inactive', is_subscriber = false where stripe_customer_id = $1`,
      [subscription.customer]
    );
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
