"use client";
import React, { useState } from "react";
import MessageList, { Message } from "./MessageList";
import MessageInput from "./MessageInput";

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return; // Prevent sending empty messages

    // Add user message
    const newMessages = [
      ...messages,
      { id: Date.now() + Math.random(), text, sender: "user" as const },
    ];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text
          }))
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      console.log("API response:", data);

      const botText = typeof data.text === "string" && data.text.trim()
        ? data.text
        : "Sorry, I didn't get that. Please try again.";

      setMessages((msgs) => [
        ...msgs,
        { id: Date.now() + Math.random(), text: botText, sender: "bot" as const },
      ]);
    } catch (err: any) {
      console.error("API error:", err);
      setMessages((msgs) => [
        ...msgs,
        {
          id: Date.now() + Math.random(),
          text: `Sorry, something went wrong. ${err?.message || ""}`,
          sender: "bot",
        },
      ]);
    }
  };

  return (
    <div className="w-full h-full border border-gray-200 rounded-xl p-4 bg-white shadow-lg text-gray-900 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} />
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatBox;
