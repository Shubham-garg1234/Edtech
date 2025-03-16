
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import ChatMessage, { MessageType } from "./ChatMessage";
import { toast } from "sonner";

// Sample data for demo purposes
const initialMessages: MessageType[] = [
  {
    id: "1",
    sender: { name: "John Doe", avatar: "" },
    message: "Hello! When will we cover the next topic?",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "2",
    sender: { name: "Sarah Kim", avatar: "" },
    message: "I'm having trouble understanding the current concept. Can you explain it again?",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: "3",
    sender: { name: "Instructor", avatar: "", isInstructor: true },
    message: "Hi Sarah, sure! I'll go over it again in a moment.",
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
  },
  {
    id: "4",
    sender: { name: "Alex Johnson", avatar: "" },
    message: "This is really interesting! Can we have more examples?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
];

const ChatSection = () => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message: MessageType = {
      id: Date.now().toString(),
      sender: { name: "Instructor", isInstructor: true },
      message: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    toast.success("Message sent");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Class Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
        <ScrollArea className="flex-1 p-4 h-[calc(100%-60px)]">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              isInstructor={message.sender.isInstructor}
            />
          ))}
        </ScrollArea>
        <div className="p-3 border-t mt-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={newMessage.trim() === ""}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSection;
