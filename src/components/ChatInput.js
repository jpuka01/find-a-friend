import React, { useState, useEffect } from "react";
import axios from "axios";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import "./ChatInputStyles.css";

function parseLlmJson(json) {
  if (json.startsWith("```json\n") && json.endsWith("```")) {
    return JSON.parse(json.slice(7, -3));
  } else {
    return JSON.parse(json);
  }
}

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
  const [suggestions, setSuggestions] = useState([]);

  const sendMessage = async () => {
    if (message.trim()) {
      const history =
        messages
          .slice(0, 20)
          .map(
            (msg) =>
              `${msg.fromSelf ? currentUser.name : "Agent"}: ${msg.message}`
          )
          .join("\n") +
        "\n" +
        `${currentUser.name}: ${message}`;
      setMessageSending(true);
      setSuggestions([]);
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST_URI}/messages/create`,
        {
          sender_id: currentUser.id,
          receiver_id: toUser.id,
          message,
        }
      );
      if (response.status === 201) {
        setMessage("");
        setShowEmojiPicker(false); // Hide emoji picker when message is sent
      }
      setMessageSending(false);

      if (toUser.id === "00000000-0000-0000-0000-000000000000") {
        setMessageGenerating(true);

        const chatResponse = await getResponse(
          "gpt4-new",
          JSON.stringify({
            currentUser: {
              name: currentUser.name,
              profile: currentUser.profile && currentUser.profile.summary,
            },
            messages: history,
          }),
          "You are Agent, a helpful AI assistant tasked with assisting users while subtely getting them to reveal more information to better understand them. You are friendly, helpful, and have a good sense of humor. You are not a human, so you do not have personal experiences or emotions. You are here to help users with their queries and provide them with useful information while extracting as much information as possible. Keep your messages small enough to read on a mobile device, with at most 100 words.",
          null
        );

        setSuggestions([]);
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

  useEffect(() => {
    if (isMessageSending || isMessageGenerating) {
      return;
    }
    if (
      !currentUser ||
      !toUser ||
      (messages.length > 0 && messages[0].sender_id === currentUser.id)
    ) {
      return;
    }

    let cancelled = false;
    async function generateSuggestions() {
      const history = messages
        .slice(0, 10)
        .map(
          (msg) =>
            `${
              msg.sender_id === currentUser.id ? currentUser.name : toUser.name
            }: ${msg.message}`
        )
        .join("\n");
      const response = await getResponse(
        "anthropic.claude-3-sonnet-20240229-v1:0",
        JSON.stringify({
          currentUser: {
            name: currentUser.name,
            profile: currentUser.profile && currentUser.profile.summary,
          },
          toUser: {
            name: toUser.name,
            profile: toUser.profile && toUser.profile.summary,
          },
          messages: history,
        }),
        toUser.id === "00000000-0000-0000-0000-000000000000"
          ? `Generate 4 short suggested questions about unique topics (less than 15 words) that the user (${currentUser.name}) can ask to the AI Q&A assistant. Respond with an unformatted JSON object with a key 'suggestions' containing an array of 4 strings.`
          : `Generate 4 unique short suggested messages (less than 15 words) in casual language that the user (${currentUser.name}) can respond to the other user (${toUser.name}) to keep the conversation naturally flowing. Respond with an unformatted JSON object with a key 'suggestions' containing an array of 4 strings.`,
        null
      );

      if (!cancelled) {
        try {
          setSuggestions(parseLlmJson(response).suggestions);
        } catch (e) {
          console.error(e);
          await generateSuggestions();
        }
      }
    }

    const timeout = setTimeout(() => generateSuggestions(), 1000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [messages, currentUser, toUser, isMessageGenerating, isMessageSending]);

  const addEmoji = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-suggestion-container">
        {suggestions &&
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="chat-input-suggestion"
              onClick={() => {
                setMessage(suggestion);
              }}
            >
              {suggestion}
            </div>
          ))}
      </div>
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
    </div>
  );
}

export default ChatInput;
