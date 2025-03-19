import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import DeviceSelector from "./DeviceSelector";
import { set } from "date-fns";

interface MediaStreamProps {
  selectedAudioDevice: string;
  setSelectedAudioDevice: (deviceId: string) => void;
  selectedVideoDevice: string;
  setSelectedVideoDevice: (deviceId: string) => void;
  streamActive: boolean;
  setStreamActive: (active: boolean) => void;
  streamStatus: "offline" | "ready" | "live" | "paused";
}

const MediaRecorderStream = ({
  selectedAudioDevice,
  setSelectedAudioDevice,
  selectedVideoDevice,
  setSelectedVideoDevice,
  streamActive,
  setStreamActive,
  streamStatus,
}: MediaStreamProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    const initializeStream = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
          audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;

        startRecording(mediaStream);
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setStreamActive(false);
      }
    };

    const startRecording = (mediaStream: MediaStream) => {
      socketRef.current = new WebSocket("ws://localhost:8081/api/stream");
      socketRef.current.onopen = () => console.log("WebSocket connected.");
      socketRef.current.onerror = (error) => console.error("WebSocket error:", error);
      
      const recorder = new MediaRecorder(mediaStream, { mimeType: "video/webm; codecs=vp8" });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(event.data);
        }
      };

      recorder.start(100);
    };

    if(selectedAudioDevice == "" || selectedVideoDevice == ""){
      setStreamActive(false);
    }
    else setStreamActive(true);
    if (streamActive) initializeStream();
    
    return () => {
      stream?.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current?.stop();
      socketRef.current?.close();
    };
  }, [selectedAudioDevice, selectedVideoDevice, streamActive]);

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !audioEnabled));
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => (track.enabled = !videoEnabled));
      setVideoEnabled(!videoEnabled);
    }
  };

  return (
    <div className="relative w-full h-full">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-3 left-3 flex space-x-2">
        <Button onClick={toggleAudio} variant="outline" size="icon">
          {audioEnabled ? <Mic /> : <MicOff className="text-red-500" />}
        </Button>
        <Button onClick={toggleVideo} variant="outline" size="icon">
          {videoEnabled ? <Video /> : <VideoOff className="text-red-500" />}
        </Button>
        <DeviceSelector
          onSelectAudioDevice={setSelectedAudioDevice}
          onSelectVideoDevice={setSelectedVideoDevice}
          streamStatus={streamStatus}
        />
      </div>
    </div>
  );
};

export default MediaRecorderStream;
