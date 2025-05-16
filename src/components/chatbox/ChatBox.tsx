"use client";
import React, { useState } from "react";
import MessageList, { Message } from "./MessageList";
import MessageInput from "./MessageInput";

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async (text: string) => {
    // Add user message
    setMessages((msgs) => [
      ...msgs,
      { id: Date.now(), text, sender: "user" },
    ]);

    // Send to API and get bot response
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      let botText = "";
      let done = false;
      const decoder = new TextDecoder();

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          // Split by newlines in case multiple protocol lines are in one chunk
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("0:")) {
              // Remove the "0:" prefix and any surrounding quotes
              let text = line.slice(2);
              // If the text is quoted (e.g. "Hello!"), remove quotes
              if (text.startsWith('"') && text.endsWith('"')) {
                text = text.slice(1, -1);
              }
              // Unescape any escaped characters
              text = text.replace(/\\"/g, '"');
              botText += text;
              setMessages((msgs) => {
                if (msgs[msgs.length - 1]?.sender === "bot") {
                  return [
                    ...msgs.slice(0, -1),
                    { ...msgs[msgs.length - 1], text: botText },
                  ];
                } else {
                  return [
                    ...msgs,
                    { id: Date.now() + 1, text: botText, sender: "bot" },
                  ];
                }
              });
            }
          }
        }
      }
    } catch (err: any) {
      console.error("API error:", err);
      setMessages((msgs) => [
        ...msgs,
        {
          id: Date.now() + 1,
          text: `Sorry, something went wrong. ${err?.message || ""}`,
          sender: "bot",
        },
      ]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border border-gray-700 rounded p-4 bg-gray-900 shadow-lg text-gray-100">
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatBox;
