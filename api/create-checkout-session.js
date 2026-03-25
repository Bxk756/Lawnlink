import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { title, price, address, location } = req.body;

  // ✅ Basic validation
  if (!title || !price) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        title,
        price: price.toString(),
        address: address || "",
        location: JSON.stringify(location || null),
      },
      success_url: "https://lawnlink.cloud/success",
      cancel_url: "https://lawnlink.cloud/cancel",
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({ error: error.message });
  }
}
