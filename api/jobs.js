import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  if (req.method === 'GET') {

    const { data, error } = await supabase
      .from('jobs')
      .select('*')

    if (error) {
      return res.status(500).json({ error })
    }

    return res.status(200).json(data)
  }

  if (req.method === 'POST') {

    const { title, price } = req.body

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          title,
          price
        }
      ])

    if (error) {
      return res.status(500).json({ error })
    }

    return res.status(200).json(data)
  }

}
