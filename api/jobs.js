export default async function handler(req, res) {

  // ✅ Allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { title, price } = req.body

    console.log("📥 Incoming:", req.body)

    // ✅ Validate
    if (!title || !price) {
      return res.status(400).json({ error: "Missing fields" })
    }

    // ✅ Fake success (for now)
    return res.status(200).json({
      success: true,
      job: {
        title,
        price
      }
    })

  } catch (err) {
    console.error("❌ ERROR:", err)
    return res.status(500).json({ error: "Server error" })
  }
}
