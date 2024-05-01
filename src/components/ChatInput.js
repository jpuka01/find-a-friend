import React, { useState } from "react";
import axios from "axios";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import "./ChatInputStyles.css";

function getResponse(model, prompt, system, temperature) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(process.env.REACT_APP_LLM_WEBSOCKET_URI);

    ws.onopen = function () {
      const message = JSON.stringify({
        action: "runModel",
        model: model,
        prompt: prompt,
        system: system,
        temperature: temperature,
      });
      ws.send(message);
    };

    ws.onmessage = function (event) {
      const response = JSON.parse(event.data);
      const message = response.result;

      if (message !== undefined) {
        ws.close();
        resolve(message);
      }
    };

    ws.onerror = function (error) {
      console.error("WebSocket Error: ", error);
      reject(error);
    };
  });
}

function ChatInput({ toUser, currentUser, messages }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMessageSending, setMessageSending] = useState(false);
  const [isMessageGenerating, setMessageGenerating] = useState(false);

  const sendMessage = async () => {
    if (message.trim()) {
      const history =
        messages
          .map(
            (msg) =>
              `${msg.fromSelf ? currentUser.username : "Agent"}: ${msg.message}`
          )
          .join("\n") +
        "\n" +
        `${currentUser.username}: ${message}`;
      setMessageSending(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST_URI}/messages/create`,
        {
          sender_id: currentUser.id,
          receiver_id: toUser.id,
          message,
        }
      );
      if (response.status === 200) {
        setMessage("");
        setShowEmojiPicker(false); // Hide emoji picker when message is sent
      }
      setMessageSending(false);

      if (toUser.id === "00000000-0000-0000-0000-000000000000") {
        setMessageGenerating(true);

        const chatResponse = await getResponse(
          "gpt4-new",
          history,
          "You are Agent, a helpful AI assistant tasked with assisting users. You are friendly, helpful, and have a good sense of humor. You are not a human, so you do not have personal experiences or emotions. You are here to help users with their queries and provide them with useful information. Keep your messages small enough to read on a mobile device, with at most 100 words.",
          null
        );

        await axios.post(
          `${process.env.REACT_APP_API_HOST_URI}/messages/create`,
          {
            sender_id: toUser.id,
            receiver_id: currentUser.id,
            message: chatResponse,
          }
        );
        setMessageGenerating(false);
      }
    }
  };

  const addEmoji = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="chat-input">
      <div className="emoji-picker-icon" onClick={toggleEmojiPicker}>
        <BsEmojiSmileFill />
      </div>
      {showEmojiPicker && (
        <Picker onEmojiClick={addEmoji} className="emoji-picker" />
      )}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isMessageSending || isMessageGenerating}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        disabled={isMessageSending || isMessageGenerating}
      >
        <IoMdSend />
      </button>
    </div>
  );
}

export default ChatInput;
