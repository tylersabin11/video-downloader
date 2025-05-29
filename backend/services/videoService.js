const play = require("play-dl");
const { execSync } = require("child_process");

exports.getVideoData = async (url) => {
  try {
    const cleanUrl = url.split("&")[0];

    if (!play.yt_validate(cleanUrl)) {
      throw new Error("Invalid YouTube URL");
    }

    const info = await play.video_info(cleanUrl);
    const title = info.video_details.title;
    const thumbnail = info.video_details.thumbnails?.at(-1)?.url || "";

    const raw = execSync(`yt-dlp -j --no-warnings "${cleanUrl}"`).toString();
    const data = JSON.parse(raw);

    const allowedHeights = {
      144: "144p",
      360: "360p",
      480: "480p",
      720: "720p",
      1080: "1080p",
      1440: "2K",
      2160: "4K",
    };

    const deduped = {};

    (data.formats || []).forEach(f => {
      const height = f.height;
      const label = allowedHeights[height];
      if (!label || f.ext !== "mp4" || !f.vcodec || !f.url) return;

      const sizeMB = f.filesize ? (f.filesize / 1048576).toFixed(1) : null;

      // Pro if 1080p+, or if format_note indicates high quality
      const premium = height >= 1080 || ["1080p", "2K", "4K", "1440p", "2160p"].includes(f.format_note);

      if (
        !deduped[label] ||
        (sizeMB && !deduped[label].sizeMB) ||
        (sizeMB && deduped[label].sizeMB && parseFloat(sizeMB) < parseFloat(deduped[label].sizeMB))
      ) {
        deduped[label] = {
          quality: label,
          url: f.url,
          sizeMB,
          premium,
        };
      }
    });

    const formats = Object.values(deduped).sort((a, b) => {
      const order = ["144p", "360p", "480p", "720p", "1080p", "2K", "4K"];
      return order.indexOf(a.quality) - order.indexOf(b.quality);
    });

    if (formats.length === 0) {
      throw new Error("No usable video formats found.");
    }

    return {
      title,
      thumbnail,
      formats,
    };
  } catch (err) {
    console.error("❌ Stream or info fetch failed:", err.message);
    throw new Error("Could not fetch video data. This may be due to region restrictions, age limits, or private content.");
  }
};
