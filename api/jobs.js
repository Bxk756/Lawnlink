import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  // 🚀 GET JOBS
  if (req.method === "GET") {

    try {

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", {
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

  // 🚀 CREATE JOB
  if (req.method === "POST") {

    try {

      const {
        title,
        price,
        description,
        lat,
        lng,
        customer_id
      } = req.body;

      console.log("📥 Incoming:", req.body);

      // 🚀 VALIDATION
      if (!title || !price) {

        return res.status(400).json({
          error: "Missing required fields"
        });

      }

      // 🚀 INSERT INTO SUPABASE
      const { data, error } = await supabase
        .from("jobs")
        .insert([
          {
            title,
            price,
            description,
            lat,
            lng,
            customer_id,
            status: "open"
          }
        ])
        .select();

      if (error) {

        console.error("❌ Supabase Error:", error);

        return res.status(500).json({
          error: error.message
        });

      }

      return res.status(200).json({
        success: true,
        job: data[0]
      });

    } catch (err) {

      console.error("❌ Server Error:", err);

      return res.status(500).json({
        error: err.message
      });

    }

  }

  // 🚀 INVALID METHOD
  return res.status(405).json({
    error: "Method not allowed"
  });

}
