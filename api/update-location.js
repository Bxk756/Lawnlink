import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    })
  }

  try {

    const {
      landscaper_id,
      lat,
      lng
    } = req.body

    if (!landscaper_id || !lat || !lng) {
      return res.status(400).json({
        error: "Missing fields"
      })
    }

    const { data, error } = await supabase
      .from("landscaper_locations")
      .upsert([
        {
          landscaper_id,
          lat,
          lng,
          updated_at: new Date().toISOString()
        }
      ])

    if (error) {
      return res.status(500).json({
        error: error.message
      })
    }

    return res.status(200).json({
      success: true,
      data
    })

  } catch (err) {

    return res.status(500).json({
      error: err.message
    })

  }

}
