import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const { title, price } = req.body

  try {

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title
            },
            unit_amount: price * 100
          },
          quantity: 1
        }
      ],

      success_url: "https://lawnlink.cloud/success",
      cancel_url: "https://lawnlink.cloud/cancel"

    })

    res.status(200).json({ url: session.url })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}
