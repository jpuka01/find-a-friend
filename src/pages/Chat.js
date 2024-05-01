import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import NavBarMessages from "../components/NavBarMessages";
import ChatNavBar from "../components/ChatNav";
import "./ChatStyles.css";

function Chat() {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("chat-app-user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      const fetchContacts = async () => {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_HOST_URI}/user/${currentUser.id}/matches`
        );
        console.log(data);
        setContacts(data);
      };
      fetchContacts();
    }
  }, [currentUser]);

  const handleChatChange = (contact) => {
    setCurrentChatUser(contact);
    localStorage.setItem("current-chat", JSON.stringify(contact));
  };

  const resetChatUser = () => {
    setCurrentChatUser(null);
    localStorage.removeItem("current-chat");
  };

  return (
    <div className="chat-container">
      {currentChatUser ? (
        <>
          <ChatNavBar
            currentUser={currentUser}
            currentChatUser={currentChatUser}
            showReturnButton={!!currentChatUser}
            onReturnClick={resetChatUser}
            inChatContainer={!!currentChatUser}
          />
          <ChatContainer toUser={currentChatUser} currentUser={currentUser} />
        </>
      ) : (
        <>
          <NavBarMessages
            currentUser={currentUser}
            showReturnButton={!!currentChatUser}
            onReturnClick={resetChatUser}
            inChatContainer={!!currentChatUser}
          />
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={handleChatChange}
          />
        </>
      )}
    </div>
  );
}

export default Chat;
