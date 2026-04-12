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

  // ✅ CREATE JOB (WITH IMAGE + LOCATION)
  if (req.method === 'POST') {

    const { title, price, lat, lng, image } = req.body

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          title,
          price,
          lat,
          lng,
          image, // ✅ THIS WAS MISSING
          status: 'open'
        }
      ])

    if (error) {
      console.log(error)
      return res.status(500).json({ error })
    }

    return res.status(200).json(data)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
