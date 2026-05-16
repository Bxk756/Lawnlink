export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    })
  }

  try {

    const {
      title,
      message
    } = req.body

    const response = await fetch(
      "https://onesignal.com/api/v1/notifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${process.env.ONESIGNAL_API_KEY}`
        },
        body: JSON.stringify({
          app_id: process.env.ONESIGNAL_APP_ID,

          included_segments: ["Subscribed Users"],

          headings: {
            en: title
          },

          contents: {
            en: message
          }

        })
      }
    )

    const data = await response.json()

    return res.status(200).json(data)

  } catch (err) {

    return res.status(500).json({
      error: err.message
    })

  }

}
