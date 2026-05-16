import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        error: "Missing jobId"
      });
    }

    const { data, error } = await supabase
      .from("jobs")
      .update({
        status: "completed",
        completed_at: new Date().toISOString()
      })
      .eq("id", jobId)
      .select();

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      job: data[0]
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
