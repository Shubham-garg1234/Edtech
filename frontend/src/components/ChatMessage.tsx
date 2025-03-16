
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export type MessageType = {
  id: string;
  sender: {
    name: string;
    avatar?: string;
    isInstructor?: boolean;
  };
  message: string;
  timestamp: Date;
};

interface ChatMessageProps {
  message: MessageType;
  isInstructor?: boolean;
}

const ChatMessage = ({ message, isInstructor }: ChatMessageProps) => {
  return (
    <div className={`flex items-start gap-3 mb-4 ${isInstructor ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
        <AvatarFallback className={message.sender.isInstructor ? "bg-blue-500 text-white" : "bg-gray-200"}>
          {message.sender.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <Card className={`p-3 max-w-[80%] ${isInstructor ? "bg-blue-100" : ""}`}>
        <div className="flex justify-between items-start mb-1">
          <span className="font-semibold text-sm">
            {message.sender.name} {message.sender.isInstructor && "(You)"}
          </span>
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-sm">{message.message}</p>
      </Card>
    </div>
  );
};

export default ChatMessage;
