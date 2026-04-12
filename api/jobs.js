import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  // ✅ GET ALL JOBS (NEWEST FIRST)
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  // ✅ CREATE JOB (WITH LOCATION + IMAGE)
  if (req.method === 'POST') {

    const { title, price, lat, lng, image } = req.body

    // 🚨 basic validation
    if (!title || !price) {
      return res.status(400).json({ error: "Missing title or price" })
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          title,
          price,
          lat,
          lng,
          image, // 👈 NEW
          status: 'open'
        }
      ])
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  // ❌ METHOD NOT ALLOWED
  return res.status(405).json({ error: 'Method not allowed' })
}
