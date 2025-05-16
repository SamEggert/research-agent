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
  <div className="flex flex-col gap-2 p-2 overflow-y-auto bg-white rounded-xl border border-gray-200 shadow flex-1">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`p-2 rounded-lg max-w-xs break-words border text-sm shadow-sm ${
          msg.sender === "user"
            ? "bg-blue-50 text-blue-900 border-blue-200 self-end"
            : "bg-gray-100 text-gray-900 border-gray-200 self-start"
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
