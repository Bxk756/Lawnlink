const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {

try {

const account = await stripe.accounts.create({
type: "express",
country: "US",
email: req.body.email || undefined,
capabilities: {
transfers: { requested: true },
card_payments: { requested: true }
},
business_type: "individual"
})

res.status(200).json({
accountId: account.id
})

} catch (err) {

console.error(err)

res.status(500).json({
error: err.message
})

}

}
