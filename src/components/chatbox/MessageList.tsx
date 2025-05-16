import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => (
  <div className="flex flex-col gap-2 p-2 overflow-y-auto bg-gray-800 rounded flex-1">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`p-2 rounded max-w-xs break-words ${
          msg.sender === "user"
            ? "bg-blue-700 text-white self-end"
            : "bg-gray-700 text-gray-100 self-start"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {msg.text.replace(/\\n/g, "\n")}
        </ReactMarkdown>
      </div>
    ))}
  </div>
);

export default MessageList;
