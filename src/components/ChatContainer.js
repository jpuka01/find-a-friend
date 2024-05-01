import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageDisplay from "./MessageDisplay";
import ChatInput from "./ChatInput";
import "./ChatContainerStyles.css"; // CSS for Chat Container

function ChatContainer({ toUser, currentUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let after = null;
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

        if (response.data.length > 0) {
          after = response.data[0].created_at;
        } else {
          after = "0";
        }
      }
    }
    fetchMessages();

    async function pollMessages() {
      if (!document.hasFocus() || after === null) {
        return;
      }
      if (toUser && currentUser) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST_URI}/messages/poll`,
          {
            user_id: currentUser.id,
            other_id: toUser.id,
            after,
          }
        );

        if (response.data.length > 0) {
          after = response.data[0].created_at;

          setMessages((prevMessages) => [...response.data, ...prevMessages]);
        }
      }
    }

    const pollInterval = setInterval(pollMessages, 5000);
    return () => clearInterval(pollInterval);
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
