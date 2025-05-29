const { spawn } = require("child_process");

exports.downloadVideo = async (req, res) => {
  const videoUrl = req.query.url;
  const title = req.query.title || "video";

  if (!videoUrl) {
    return res.status(400).json({ error: "Missing video URL" });
  }

  try {
    const safeTitle = title.replace(/[^\w\s-]/g, "_");
    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.mp4"`);
    res.setHeader("Content-Type", "video/mp4");

    const ytdlp = spawn("yt-dlp", [
      videoUrl,
      "-f", "best[ext=mp4]",
      "-o", "-", // output to stdout
    ]);

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on("data", (data) => {
      console.error("yt-dlp error:", data.toString());
    });

    ytdlp.on("error", (err) => {
      console.error("yt-dlp spawn error:", err.message);
      res.status(500).json({ error: "Download failed." });
    });

    ytdlp.on("close", (code) => {
      if (code !== 0) {
        console.error(`yt-dlp exited with code ${code}`);
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
