
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StreamOptionsProps {
  activeOption: "camera" | "screen" | "whiteboard";
  onChange: (option: "camera" | "screen" | "whiteboard") => void;
}

const StreamOptions = ({ activeOption, onChange }: StreamOptionsProps) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Display Options</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2">
        <Button
          variant={activeOption === "camera" ? "default" : "outline"}
          className="flex flex-col h-20 px-2 items-center justify-center gap-1"
          onClick={() => onChange("camera")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
          <span className="text-xs">Camera</span>
        </Button>
        
        <Button
          variant={activeOption === "screen" ? "default" : "outline"}
          className="flex flex-col h-20 px-2 items-center justify-center gap-1"
          onClick={() => onChange("screen")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
          <span className="text-xs">Screen</span>
        </Button>
        
        <Button
          variant={activeOption === "whiteboard" ? "default" : "outline"}
          className="flex flex-col h-20 px-2 items-center justify-center gap-1"
          onClick={() => onChange("whiteboard")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-line"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          <span className="text-xs">Whiteboard</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default StreamOptions;
