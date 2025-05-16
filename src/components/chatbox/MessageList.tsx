import React from "react";

export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => (
  <div className="flex flex-col gap-2 p-2 overflow-y-auto h-64 bg-gray-800 rounded">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`p-2 rounded max-w-xs break-words ${
          msg.sender === "user"
            ? "bg-blue-700 text-white self-end"
            : "bg-gray-700 text-gray-100 self-start"
        }`}
      >
        {msg.text}
      </div>
    ))}
  </div>
);

export default MessageList;
