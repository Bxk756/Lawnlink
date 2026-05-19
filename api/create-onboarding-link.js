const Stripe = require("stripe")

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {

try {

const { accountId } = req.body

const accountLink =
await stripe.accountLinks.create({

account: accountId,

refresh_url:
"https://lawnlink-ruby.vercel.app/contractor-onboarding.html",

return_url:
"https://lawnlink-ruby.vercel.app/payout-dashboard.html",

type: "account_onboarding"

})

res.status(200).json({
url: accountLink.url
})

} catch (err) {

console.error(err)

res.status(500).json({
error: err.message
})

}

}
