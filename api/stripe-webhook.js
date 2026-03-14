import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req,res){

if(req.method !== "POST"){
return res.status(405).end()
}

const sig = req.headers["stripe-signature"]

let event

try{

event = stripe.webhooks.constructEvent(
req.rawBody,
sig,
process.env.STRIPE_WEBHOOK_SECRET
)

}catch(err){

return res.status(400).send(`Webhook error: ${err.message}`)

}

if(event.type === "checkout.session.completed"){

const session = event.data.object

const title = session.metadata.title
const price = session.metadata.price

await supabase
.from("jobs")
.insert([
{
title:title,
price:price
}
])

}

res.json({received:true})

}
