import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {

try {

const {
amount,
destination
} = req.body

const transfer =
await stripe.transfers.create({

amount,
currency: "usd",
destination

})

res.status(200).json({
success: true,
transfer
})

} catch (err) {

console.error(err)

res.status(500).json({
error: err.message
})

}

}
