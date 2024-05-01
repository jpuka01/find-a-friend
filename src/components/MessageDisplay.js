import React from "react";
import "./MessageDisplayStyles.css"; // Styles for messages

function MessageDisplay({ currentUser, messages }) {
  return (
    <div className="message-display">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${
            message.sender_id === currentUser.id ? "sent" : "received"
          }`}
        >
          {message.message}
        </div>
      ))}
    </div>
  );
}

export default MessageDisplay;
