
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LivestreamControlsProps {
  status: "offline" | "ready" | "live" | "paused";
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

const LivestreamControls = ({ status, onStart, onPause, onStop }: LivestreamControlsProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Stream Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(status === "offline" || status === "ready" || status === "paused") && (
          <Button 
            onClick={onStart} 
            className="w-full flex items-center justify-center gap-2"
            variant="default"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            {status === "offline" ? "Prepare Stream" : "Start Stream"}
          </Button>
        )}
        
        {status === "live" && (
          <Button 
            onClick={onPause} 
            className="w-full flex items-center justify-center gap-2"
            variant="secondary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>
            Pause Stream
          </Button>
        )}
        
        {status !== "offline" && (
          <Button 
            onClick={onStop} 
            className="w-full flex items-center justify-center gap-2"
            variant="destructive"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
            End Stream
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LivestreamControls;
