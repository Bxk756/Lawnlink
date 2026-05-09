import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const landscaperId = req.query.landscaperId;

    if (!landscaperId) {
      return res.status(400).json({
        error: "Missing landscaperId"
      });
    }

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("landscaper_id", landscaperId)
      .order("accepted_at", {
        ascending: false
      });

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    return res.status(200).json(data);

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
