import express from "express";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const app = express();
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


// GET ALL JOBS
app.get("/api/jobs", async (req, res) => {

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});


// CREATE JOB
app.post("/api/jobs", async (req, res) => {

  const { service, price, address } = req.body;

  const { data, error } = await supabase
    .from("jobs")
    .insert([
      {
        service,
        price,
        address,
        status: "open"
      }
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});


// STRIPE CHECKOUT
app.post("/api/create-checkout-session", async (req, res) => {

  const { amount } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "LawnLink Service"
          },
          unit_amount: amount * 100
        },
        quantity: 1
      }
    ],
    mode: "payment",
    success_url: "https://api.lawnlink.cloud/success",
    cancel_url: "https://api.lawnlink.cloud/cancel"
  });

  res.json({ url: session.url });
});


export default app;
