import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  
  const raw = localStorage.getItem("loggedInUser");
  let user = null;
  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!user) return;

    const stored = localStorage.getItem("messages");
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const mockMessages = [
        {
          id: 1,
          sender: "landlord",
          text: "Hello! How can I help you today?",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: "read"
        },
        {
          id: 2,
          sender: "tenant",
          text: "Hi! I submitted a maintenance request for the leaking faucet. Any update?",
          timestamp: new Date(Date.now() - 82800000).toISOString(),
          status: "read"
        },
        {
          id: 3,
          sender: "landlord",
          text: "Yes, I've scheduled a plumber to come by tomorrow at 2 PM. Will you be available?",
          timestamp: new Date(Date.now() - 79200000).toISOString(),
          status: "read"
        },
        {
          id: 4,
          sender: "tenant",
          text: "Perfect! I'll make sure to be home. Thank you!",
          timestamp: new Date(Date.now() - 75600000).toISOString(),
          status: "read"
        },
        {
          id: 5,
          sender: "landlord",
          text: "Great! Let me know if there are any issues.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: "delivered"
        },
        {
          id: 6,
          sender: "tenant",
          text: "Will do. Also, when is the next rent payment due?",
          timestamp: new Date(Date.now() - 600000).toISOString(),
          status: "sent"
        }
      ];
      localStorage.setItem("messages", JSON.stringify(mockMessages));
      setMessages(mockMessages);
    }
  }, []);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      sender: user?.role || "tenant",
      text,
      timestamp: new Date().toISOString(),
      status: "sent"
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem("messages", JSON.stringify(updatedMessages));

    setTimeout(() => {
      const deliveredMessages = updatedMessages.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
      );
      setMessages(deliveredMessages);
      localStorage.setItem("messages", JSON.stringify(deliveredMessages));
    }, 1000);

    setTimeout(() => {
      const readMessages = updatedMessages.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: "read" } : msg
      );
      setMessages(readMessages);
      localStorage.setItem("messages", JSON.stringify(readMessages));
    }, 3000);
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold text-white flex items-center">
              💬 Messages
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Chat with your {user.role === "tenant" ? "landlord" : "tenant"}
            </p>
          </div>

          <ChatBox 
            messages={messages}
            currentUser={user.role}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;
