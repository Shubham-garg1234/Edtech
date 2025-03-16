
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import DeviceSelector from "./DeviceSelector";

interface VideoPreviewProps {
  activeOption: "camera" | "screen" | "whiteboard";
}

const VideoPreview = ({ activeOption }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const startVideoPreview = async () => {
    if (activeOption === "camera" && videoRef.current) {
      try {
        stopAllTracks();
        
        const constraints: MediaStreamConstraints = {
          video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
          audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true,
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setStreamActive(true);
        
        // Set initial states based on tracks
        const videoTrack = mediaStream.getVideoTracks()[0];
        const audioTrack = mediaStream.getAudioTracks()[0];
        
        if (videoTrack) {
          videoTrack.enabled = videoEnabled;
        }
        
        if (audioTrack) {
          audioTrack.enabled = audioEnabled;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setStreamActive(false);
      }
    } else {
      setStreamActive(true);
    }
  };
  
  const stopAllTracks = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };
  
  useEffect(() => {
    startVideoPreview();
    
    return () => {
      stopAllTracks();
    };
  }, [activeOption, selectedAudioDevice, selectedVideoDevice]);
  
  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
        setAudioEnabled(!audioEnabled);
      }
    }
  };
  
  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
        setVideoEnabled(!videoEnabled);
      }
    }
  };
  
  const handleSelectAudioDevice = (deviceId: string) => {
    setSelectedAudioDevice(deviceId);
  };
  
  const handleSelectVideoDevice = (deviceId: string) => {
    setSelectedVideoDevice(deviceId);
  };
  
  return (
    <Card className="shadow-md overflow-hidden">
      <CardContent className="p-0 relative aspect-video bg-slate-900 flex items-center justify-center">
        {activeOption === "camera" && (
          <>
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted
              className={`w-full h-full object-cover ${!videoEnabled ? 'invisible' : ''}`}
            ></video>
            
            {!streamActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white bg-black/50 p-4 rounded-md">
                  Camera preview unavailable
                </div>
              </div>
            )}
            
            {!streamActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video opacity-20"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
              </div>
            )}
            
            {!videoEnabled && streamActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoOff className="h-16 w-16 text-white opacity-20" />
              </div>
            )}
          </>
        )}
        
        {activeOption === "screen" && (
          <div className="flex flex-col items-center justify-center text-white space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
            <p className="opacity-60">Screen sharing preview</p>
          </div>
        )}
        
        {activeOption === "whiteboard" && (
          <div className="flex flex-col items-center justify-center text-white space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-line"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            <p className="opacity-60">Whiteboard preview</p>
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 flex space-x-2">
          <Button
            onClick={toggleAudio}
            variant="outline"
            size="icon"
            className={`h-8 w-8 rounded-full ${audioEnabled ? 'bg-white/10' : 'bg-red-500/80'} backdrop-blur-sm`}
          >
            {audioEnabled ? (
              <Mic className="h-4 w-4 text-white" />
            ) : (
              <MicOff className="h-4 w-4 text-white" />
            )}
          </Button>
          
          <Button
            onClick={toggleVideo}
            variant="outline"
            size="icon"
            className={`h-8 w-8 rounded-full ${videoEnabled ? 'bg-white/10' : 'bg-red-500/80'} backdrop-blur-sm`}
          >
            {videoEnabled ? (
              <Video className="h-4 w-4 text-white" />
            ) : (
              <VideoOff className="h-4 w-4 text-white" />
            )}
          </Button>
          
          <div className="absolute right-0 ml-4">
            <DeviceSelector
              onSelectAudioDevice={handleSelectAudioDevice}
              onSelectVideoDevice={handleSelectVideoDevice}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPreview;
