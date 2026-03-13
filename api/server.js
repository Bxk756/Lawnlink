import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method === "GET") {
    return res.status(200).json({ message: "LawnLink API running" });
  }

  if (req.method === "POST") {

    const { jobId, amount, applicationFee, connectedAccountId } = req.body;

    try {

      const session = await stripe.checkout.sessions.create({

        payment_method_types: ["card"],

        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: `LawnLink Job #${jobId}`
            },
            unit_amount: amount
          },
          quantity: 1
        }],

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

      return res.status(200).json({ url: session.url });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error: "Stripe checkout failed"
      });

    }

  }

}
