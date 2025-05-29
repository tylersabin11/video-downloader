import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [platform, setPlatform] = useState("youtube");
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPlatformUrlValid = (url, platform) => {
    const patterns = {
      youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/,
      instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/,
    };
    return patterns[platform]?.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setVideoData(null);

    if (!isPlatformUrlValid(url, platform)) {
      setError(`The URL does not match the selected platform (${platform}).`);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/videos/fetch", { url });
      setVideoData(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not fetch video data. Please try a different URL.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 flex flex-col animate-gradient-move">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="ClipFetch logo" className="w-20 h-auto" />
        </div>
        <nav className="space-x-4">
          <Link to="/pricing" className="text-gray-700 hover:text-red-600 font-medium">Pricing</Link>
          <Link to="/login" className="text-gray-700 hover:text-red-600 font-medium">Login</Link>
          <Link
            to="/signup"
            className="border border-red-600 text-red-600 px-4 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md space-y-6">
          <h1 className="text-3xl font-extrabold text-center text-black">
            Video Downloader
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700"
            >
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
            </select>

            <input
              type="url"
              required
              placeholder="Paste video URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700"
            />

            <button
              type="submit"
              className="w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700 transition"
            >
              {loading ? "Fetching..." : "Fetch Download Options"}
            </button>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          </form>
        </div>

        {/* Video Display */}
        {videoData && (
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mt-6 space-y-4">
            <h2 className="text-xl font-bold text-black text-center">{videoData.title}</h2>

            {/* Playable Thumbnail */}
            {videoData.thumbnail && (
              <div
                className="relative group cursor-pointer"
                onClick={() => window.open(videoData.formats[0].url, "_blank")}
              >
                <img
                  src={videoData.thumbnail}
                  alt="Preview"
                  className="w-full rounded-md shadow"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Download Options */}
            <div>
              <h3 className="font-bold mb-2 text-black">Download Options:</h3>
              <ul className="space-y-2">
              {videoData.formats.map((format, index) => (
                <li key={index}>
                  <span className="font-semibold text-black">
                    {format.quality} {format.sizeMB ? `(${format.sizeMB} MB)` : ""}:
                  </span>{" "}
                  {format.premium ? (
                    <span className="text-red-500">Pro Only🔒</span>
                  ) : (
                    <a
                      href={`http://localhost:5000/api/videos/download?url=${encodeURIComponent(format.url)}&title=${encodeURIComponent(videoData.title)}`}
                      className="text-blue-600 underline"
                    >
                      Download
                    </a>
                  )}
                </li>
              ))}
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                If the download doesn’t start, right-click and choose “Save link as.”
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
