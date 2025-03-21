import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface HLSPlayerProps {
  streamUrl: string;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ streamUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (Hls.isSupported() && streamUrl) {
      const hls = new Hls({
        lowLatencyMode: true,
        liveSyncDurationCount: 2,
        liveMaxLatencyDurationCount: 3,
        maxLiveSyncPlaybackRate: 1.5,
      });

      hls.loadSource(streamUrl);
      if (videoRef.current) {
        hls.attachMedia(videoRef.current);
      }

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play();
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          hls.destroy();
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current && videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamUrl;
      videoRef.current.addEventListener("loadedmetadata", () => videoRef.current?.play());
    }
  }, [streamUrl]);

  return (
    <div className="hls-player-container relative">
      <div className="video-wrapper relative bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          controls
        />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default HLSPlayer;
