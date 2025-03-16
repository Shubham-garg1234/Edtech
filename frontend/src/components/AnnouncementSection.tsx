
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Megaphone, Send } from "lucide-react";
import { toast } from "sonner";

type Announcement = {
  id: string;
  content: string;
  timestamp: Date;
};

// Sample announcements for demo
const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    content: "We'll be covering advanced topics in next week's session. Please review the materials from today.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    content: "Don't forget to submit your homework by Friday!",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
];

const AnnouncementSection = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [newAnnouncement, setNewAnnouncement] = useState("");

  const handleSendAnnouncement = () => {
    if (newAnnouncement.trim() === "") return;

    const announcement: Announcement = {
      id: Date.now().toString(),
      content: newAnnouncement,
      timestamp: new Date(),
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement("");
    toast.success("Announcement sent to all participants");
  };

  return (
    <Card className="h-full">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Megaphone className="w-5 h-5" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
        <div className="p-3 border-b">
          <Textarea
            placeholder="Make an announcement to the class..."
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            className="min-h-24 resize-none mb-2"
          />
          <Button 
            className="w-full"
            onClick={handleSendAnnouncement}
            disabled={newAnnouncement.trim() === ""}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Announcement
          </Button>
        </div>
        <ScrollArea className="flex-1 p-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="mb-4">
              <Card className="p-3 bg-amber-50 border-amber-200">
                <p className="text-sm">{announcement.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {announcement.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </Card>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AnnouncementSection;
