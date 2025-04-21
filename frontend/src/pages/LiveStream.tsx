
import { useRef, useState, useEffect } from "react";
import LivestreamControls from "@/components/LivestreamControls";
import StreamStatus from "@/components/StreamStatus";
import StreamOptions from "@/components/StreamOptions";
import ChatSection from "@/components/ChatSection";
import AnnouncementSection from "@/components/AnnouncementSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Megaphone, VolumeX, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import DeviceSelector from "@/components/DeviceSelector";

const LiveStream = () => {
  const [streamStatus, setStreamStatus] = useState<"offline" | "ready" | "live" | "paused">("offline");
  const [activeOption, setActiveOption] = useState<"camera" | "screen" | "whiteboard">("camera");
  const [streamActive, setStreamActive] = useState(false);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const courseId = window.location.pathname.split('/').pop();
  const navigate = useNavigate();

  const checkStream = async () => {
    const response = await fetch("http://localhost:8081/api/checkStream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseId)
    });
    if(response.ok){
      setStreamStatus("offline");
    }
    else setStreamStatus("paused");
  };

  useEffect(() => {
    checkStream();
  }, []);

  const startRecording = (mediaStream: MediaStream) => {
    socketRef.current = new WebSocket(`ws://localhost:8081/api/stream?courseId=${courseId}`);
    socketRef.current.onopen = () => {
        console.log("WebSocket connected.");
        setStreamStatus("live");
        toast.success("You are now live");
    };
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

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  
    if (socketRef.current) {
      socketRef.current.close();
      console.log("WebSocket closed.");
    }
  };
  
  const handleStartStream = async () => {
    if (streamStatus === "offline") {
      if (!window.confirm("Are you sure you want to start the stream?")) return;
      const response = await fetch("http://localhost:8081/api/prepareStream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseId)
      });
      if(response.ok){
        setStreamStatus("ready");
        toast.success("Stream ready to start");
      }
      else{
        toast.error("Stream has already started on some other device");
      }
    } else if (streamStatus === "ready" || streamStatus === "paused") {
      if(activeOption === "camera"){
        startRecording(stream);
      }
    }
  };

  const handlePauseStream = () => {
    if (streamStatus === "live") {
      stopRecording();
      setStreamStatus("paused");
      toast.info("Stream paused");
    }
  };

  const handleStopStream = async () => {
    if (streamStatus !== "offline") {
      stopRecording();
      if (!window.confirm("Are you sure you want to end the stream?")) return;
      const response = await fetch("http://localhost:8081/api/endStream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseId)
      });
      if(response.ok){
        setStreamStatus("offline");
        toast.info("Stream ended");
      }
      else{
        toast.error("Stream fails to end");
      }
    }
  };

  const handleGoBack = () => {
    navigate(`/manageCourses/${courseId}`);
  };

  const handleChangeOption = (option: "camera" | "screen" | "whiteboard") => {
    if(streamStatus === "live"){
      toast.error("Cannot switch view while stream is live");
      return;
    }
    setActiveOption(option);
    toast.success(`Switched to ${option} view`);
  };

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
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setStreamActive(false);
      }
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

  const toggleSpeaker = () => {
    if(stream){
      setSpeakerEnabled(!speakerEnabled);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-6 px-4 md:px-8">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={handleGoBack}
              className="mr-4 p-2 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </button>
            <h1 className="text-2xl font-bold text-slate-800">Instructor Stream Control</h1>
          </div>
          <StreamStatus status={streamStatus} />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className={`mb-6 ${!streamActive ? "bg-black rounded-2xl opacity-90" : "bg-transparent"}`}>
              <div className="relative w-full h-full">
                <video ref={videoRef} muted={!speakerEnabled} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 flex space-x-2">
                  <Button onClick={toggleSpeaker} variant="outline" size="icon" aria-label={speakerEnabled ? "Unmute" : "Mute"}>
                    {!speakerEnabled ? <VolumeX className="h-5 w-5 text-red-500" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LivestreamControls 
                status={streamStatus}
                onStart={handleStartStream}
                onPause={handlePauseStream}
                onStop={handleStopStream}
              />
              <StreamOptions 
                activeOption={activeOption} 
                onChange={handleChangeOption}
              />
            </div>
          </div>
          
          <div className="lg:col-span-4 h-[600px]">
            <Tabs defaultValue="chat" className="h-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="announcements" className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  Announcements
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="h-[calc(100%-52px)]">
                <ChatSection />
              </TabsContent>
              <TabsContent value="announcements" className="h-[calc(100%-52px)]">
                <AnnouncementSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
