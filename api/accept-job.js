import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { jobId, landscaperId } = req.body;

  if (!jobId || !landscaperId) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    const { data, error } = await supabase
      .from("jobs")
      .update({
        status: "accepted",
        landscaper_id: landscaperId,
        accepted_at: new Date().toISOString(),
      })
      // ✅ STRONG atomic lock
      .eq("id", jobId)
      .eq("status", "open")
      .is("landscaper_id", null)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(400).json({
        error: "Job already accepted",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      job: data[0],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
