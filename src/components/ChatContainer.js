import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageDisplay from "./MessageDisplay";
import ChatInput from "./ChatInput";
import "./ChatContainerStyles.css"; // CSS for Chat Container

function ChatContainer({ toUser, currentUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      if (toUser && currentUser) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST_URI}/messages`,
          {
            user_id: currentUser.id,
            other_id: toUser.id,
          }
        );

        setMessages(response.data);
      }
    }
    fetchMessages();

    const fetchInterval = setInterval(fetchMessages, 5000);
    return () => clearInterval(fetchInterval);
  }, [currentUser, toUser]);

  return (
    <div className="chat-container">
      <MessageDisplay messages={messages} currentUser={currentUser} />
      <ChatInput
        toUser={toUser}
        currentUser={currentUser}
        messages={messages}
      />
    </div>
  );
}

export default ChatContainer;
