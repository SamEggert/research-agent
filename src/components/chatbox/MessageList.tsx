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
  <div className="flex flex-col gap-2 p-2 overflow-y-auto bg-white rounded-xl flex-1">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`p-2 rounded-lg max-w-xl break-words text-md border border-gray-200 shadow-md ${
          msg.sender === "user"
            ? "text-gray-900 bg-gray-50 self-end "
            : " text-gray-900 self-start"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {msg.sender === "bot"
            ? msg.text.replace(/\\n/g, "\n").replace(/\n/g, "\n\n")
            : msg.text.replace(/\\n/g, "\n")}
        </ReactMarkdown>
      </div>
    ))}
  </div>
);

export default MessageList;
