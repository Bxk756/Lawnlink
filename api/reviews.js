import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {

  // ✅ GET REVIEWS
  if (req.method === "GET") {

    try {

      const { landscaperId } = req.query;

      if (!landscaperId) {
        return res.status(400).json({
          error: "Missing landscaperId"
        });
      }

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("landscaper_id", landscaperId)
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

  // ✅ CREATE REVIEW
  if (req.method === "POST") {

    try {

      const {
        job_id,
        landscaper_id,
        customer_id,
        rating,
        comment
      } = req.body;

      if (
        !job_id ||
        !landscaper_id ||
        !customer_id ||
        !rating
      ) {

        return res.status(400).json({
          error: "Missing fields"
        });

      }

      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            job_id,
            landscaper_id,
            customer_id,
            rating,
            comment
          }
        ])
        .select();

      if (error) {
        return res.status(500).json({
          error: error.message
        });
      }

      return res.status(200).json({
        success: true,
        review: data[0]
      });

    } catch (err) {

      return res.status(500).json({
        error: err.message
      });

    }

  }

  return res.status(405).json({
    error: "Method not allowed"
  });

}
