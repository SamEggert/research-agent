import React, { useState } from "react";
import { FiArrowUp } from "react-icons/fi";

interface MessageInputProps {
  onSend: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        className="flex-1 border border-gray-300 rounded-lg p-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 shadow-sm"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow"
        onClick={handleSend}
        aria-label="Send"
      >
        <FiArrowUp size={20} />
      </button>
    </div>
  );
};

export default MessageInput;
