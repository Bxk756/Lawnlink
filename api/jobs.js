import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  // ✅ GET ALL JOBS
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')

    if (error) {
      return res.status(500).json({ error })
    }

    return res.status(200).json(data)
  }

  // ✅ CREATE JOB (WITH LOCATION)
  if (req.method === 'POST') {

    const { title, price, lat, lng } = req.body

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          title,
          price,
          lat,
          lng,
          status: 'open'
        }
      ])

    if (error) {
      return res.status(500).json({ error })
    }

    return res.status(200).json(data)
  }

  // ❌ METHOD NOT ALLOWED
  return res.status(405).json({ error: 'Method not allowed' })
}
