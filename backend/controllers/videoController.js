const videoService = require('../services/videoService');

exports.fetchVideo = async (req, res) => {
  try {
    const { url } = req.body;
    console.log("📥 Request received for:", url);  // ✅ Log incoming request

    const data = await videoService.getVideoData(url);

    console.log("✅ Video data fetched successfully");
    res.json(data);
  } catch (err) {
    console.error("❌ Video fetch error:", err);  // ✅ Log full error
    res.status(500).json({ error: err.message || "Server Error" });
  }
};
