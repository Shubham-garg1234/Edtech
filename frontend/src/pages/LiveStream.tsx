
import { useState } from "react";
import LivestreamControls from "@/components/LivestreamControls";
import VideoPreview from "@/components/VideoPreview";
import StreamStatus from "@/components/StreamStatus";
import StreamOptions from "@/components/StreamOptions";
import ChatSection from "@/components/ChatSection";
import AnnouncementSection from "@/components/AnnouncementSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LiveStream = () => {
  const [streamStatus, setStreamStatus] = useState<"offline" | "ready" | "live" | "paused">("offline");
  const [activeOption, setActiveOption] = useState<"camera" | "screen" | "whiteboard">("camera");
  const [streamActive, setStreamActive] = useState(false);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  
  const handleStartStream = () => {
    if (streamStatus === "offline") {
      setStreamStatus("ready");
      toast.success("Stream ready to start");
    } else if (streamStatus === "ready" || streamStatus === "paused") {
      if(streamActive === false){
        toast.error("Allow access to camera and microphone to start stream");
      }
      else {
        setStreamStatus("live");
        if(activeOption === "camera"){
          
        }
        else{

        }
        toast.success("Stream started");
      }
    }
  };

  const handlePauseStream = () => {
    if (streamStatus === "live") {
      setStreamStatus("paused");
      toast.info("Stream paused");
    }
  };

  const handleStopStream = () => {
    if (streamStatus !== "offline") {
      setStreamStatus("offline");
      toast.info("Stream ended");
    }
  };

  const courseId = window.location.pathname.split('/').pop();
  const navigate = useNavigate();

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
            <div className="mb-6">
              <VideoPreview streamActive={streamActive} setStreamActive={setStreamActive} streamStatus={streamStatus} selectedAudioDevice={selectedAudioDevice} selectedVideoDevice={selectedVideoDevice} setSelectedAudioDevice={setSelectedAudioDevice} setSelectedVideoDevice={setSelectedVideoDevice} />
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
