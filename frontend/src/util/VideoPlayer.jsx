import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const VideoPlayer = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lectureTitle = location.state?.title || "Lecture";
  const videoUrl = `http://localhost:8081/api/video/${key}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          {lectureTitle}
        </h2>
        <video
          controls
          className="w-full rounded-xl border border-gray-300 shadow-sm"
          controlsList="nodownload"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
