const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/*
------------------------------
ROOT TEST ROUTE
------------------------------
*/

app.get("/", (req, res) => {
  res.send("LawnLink API running");
});

/*
------------------------------
CREATE STRIPE CONNECT ACCOUNT
------------------------------
*/

app.post("/api/connect-account", async (req, res) => {
  try {
    const { email } = req.body;

    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      }
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://lawnlink.cloud/reauth",
      return_url: "https://lawnlink.cloud/dashboard",
      type: "account_onboarding"
    });

    res.json({
      url: accountLink.url,
      accountId: account.id
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Stripe onboarding failed"
    });
  }
});

/*
------------------------------
CREATE CHECKOUT SESSION
------------------------------
*/

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { jobId, amount, applicationFee, connectedAccountId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `LawnLink Job #${jobId}`
            },
            unit_amount: amount
          },
          quantity: 1
        }
      ],

      mode: "payment",

      payment_intent_data: {
        application_fee_amount: applicationFee,
        transfer_data: {
          destination: connectedAccountId
        }
      },

      success_url: "https://lawnlink.cloud/success",
      cancel_url: "https://lawnlink.cloud/jobs"
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Checkout session failed"
    });
  }
});

/*
------------------------------
START SERVER
------------------------------
*/

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
  console.log(`🚀 LawnLink backend running on http://localhost:${PORT}`);
});
