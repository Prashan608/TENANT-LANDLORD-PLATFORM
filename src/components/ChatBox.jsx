import { useState, useEffect, useRef } from "react";

const ChatBox = ({ messages, currentUser, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return <span className="text-blue-500">✓✓</span>;
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-[500px] md:h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] md:max-w-[60%] ${
                msg.sender === currentUser
                  ? "bg-blue-500 text-white rounded-l-lg rounded-tr-lg"
                  : "bg-gray-200 text-gray-800 rounded-r-lg rounded-tl-lg"
              } px-4 py-2 shadow-md`}
            >
              <p className="text-sm md:text-base break-words">{msg.text}</p>
              <div
                className={`flex items-center justify-end gap-2 mt-1 text-xs ${
                  msg.sender === currentUser
                    ? "text-blue-100"
                    : "text-gray-600"
                }`}
              >
                <span>{formatTime(msg.timestamp)}</span>
                {msg.sender === currentUser && (
                  <span className="text-xs">{getStatusIcon(msg.status)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t bg-white p-4 flex gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-blue-500 text-white px-4 md:px-6 py-2 rounded-full hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span className="hidden md:inline">Send</span>
          <span className="md:hidden text-lg">➤</span>
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
