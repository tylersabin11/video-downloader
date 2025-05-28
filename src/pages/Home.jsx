import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [platform, setPlatform] = useState("youtube");
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Platform: ${platform}\nURL: ${url}`);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 flex flex-col animate-gradient-move">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="ClipFetch logo"
            className="w-20 h-auto"
          />
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
      <main className="flex-grow flex items-center justify-center px-4">
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
              Fetch Download Options
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
