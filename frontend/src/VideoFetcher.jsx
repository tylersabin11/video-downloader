import React, { useState } from 'react';
import axios from 'axios';

const VideoFetcher = () => {
  const [url, setUrl] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/videos/fetch', { url });
      setVideoData(response.data);
    } catch (err) {
      console.error('Error fetching video:', err);
      alert('Failed to fetch video. Make sure the backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto text-white p-4">
      <input
        className="w-full p-2 rounded bg-gray-800 mb-2"
        type="text"
        placeholder="Paste video URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        onClick={handleFetch}
        disabled={loading}
      >
        {loading ? 'Fetching...' : 'Fetch Video'}
      </button>

      {videoData && (
        <div className="mt-6">
          <img src={videoData.previewImage} alt="Preview" className="rounded mb-4" />
          <video src={videoData.playableUrl} controls className="w-full rounded mb-4" />
          <div>
            <h3 className="font-bold mb-2">Download Options:</h3>
            <ul>
              {videoData.formats.map((format, index) => (
                <li key={index} className="mb-1">
                  {format.quality} — {format.premium ? 'Pro Only' : 'Free'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFetcher;
