const play = require("play-dl");

exports.getVideoData = async (url) => {
  if (!url) throw new Error("Missing video URL");

  const isYoutube = play.yt_validate(url) === "video";
  const isTiktok = url.includes("tiktok.com");

  // ⛔ Block TikTok for now to prevent crash
  if (isTiktok) {
    throw new Error("TikTok support is temporarily disabled.");
  }

  if (!isYoutube) {
    throw new Error("Only YouTube is supported at this time.");
  }

  try {
    const info = await play.video_basic_info(url);
    const title = info.video_details.title;
    const thumbnail = info.video_details.thumbnails?.at(-1)?.url;

    const stream = await play.stream(url);
    const streamUrl = stream?.url;

    if (!streamUrl) throw new Error("No stream URL found");

    return {
      title,
      previewImage: thumbnail,
      playableUrl: streamUrl,
      formats: [
        { quality: "480p", url: streamUrl, premium: false },
        { quality: "720p", url: streamUrl, premium: false },
        { quality: "1080p", url: streamUrl, premium: true },
        { quality: "1440p", url: streamUrl, premium: true },
        { quality: "4K", url: streamUrl, premium: true },
      ],
    };
  } catch (err) {
    console.error("❌ Stream or info fetch failed:", err.message);
    throw new Error("Could not fetch video data. This may be due to region restrictions, age limits, or private content.");
  }
};
