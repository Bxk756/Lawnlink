import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req,res){

if(req.method !== "POST"){

return res.status(405).json({
error:"Method not allowed"
})

}

try{

const {

amount,
jobName,
customerName

} = req.body

if(!amount){

return res.status(400).json({
error:"Missing amount"
})

}

const paymentIntent =
await stripe.paymentIntents.create({

amount:Math.round(amount * 100),

currency:"usd",

automatic_payment_methods:{
enabled:true
},

metadata:{
jobName:jobName || "LawnLink Job",
customerName:customerName || "Customer"
}

})

return res.status(200).json({

clientSecret:
paymentIntent.client_secret

})

}catch(error){

console.error(error)

return res.status(500).json({

error:error.message

})

}

}
