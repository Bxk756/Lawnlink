const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {

try {

const {
amount,
destination
} = req.body

const transfer =
await stripe.transfers.create({

amount: amount,
currency: "usd",
destination: destination

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
