import Stripe from "stripe";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const rawBody = await buffer(req);
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (
    event.type === "checkout.session.completed" &&
    event.data.object.payment_status === "paid"
  ) {
    const session = event.data.object;

    const { data: existing } = await supabase
      .from("jobs")
      .select("id")
      .eq("payment_id", session.id)
      .maybeSingle();

    if (existing) {
      return res.status(200).json({ received: true });
    }

    const metadata = session.metadata || {};

    const title = metadata.title || "Lawn Service";
    const price =
      parseFloat(metadata.price) || session.amount_total / 100;
    const address = metadata.address || "";

    let location = null;
    try {
      location = metadata.location
        ? JSON.parse(metadata.location)
        : null;
    } catch (e) {
      console.warn("Invalid location JSON");
    }

    const customerEmail = session.customer_details?.email || "";
    const customerName = session.customer_details?.name || "";

    const { data, error } = await supabase.from("jobs").insert([
      {
        title,
        price,
        customer_email: customerEmail,
        customer_name: customerName,
        payment_status: "paid",
        payment_id: session.id,
        address,
        location,
        status: "open",
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        return res.status(200).json({ received: true });
      }

      console.error("Error creating job:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("Job created:", data);
  }

  return res.status(200).json({ received: true });
}
