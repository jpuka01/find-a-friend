import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Contacts from "../components/Contacts";
import ChatContainer from "../components/ChatContainer";
import NavBarMessages from "../components/NavBarMessages";
import ChatNavBar from "../components/ChatNav";
import "./ChatStyles.css";

function Chat() {
  const { id } = useParams();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      if (id === "00000000-0000-0000-0000-000000000000") {
        setCurrentChatUser({
          id: "00000000-0000-0000-0000-000000000000",
          name: "Agent",
        });
      } else {
        const user = contacts.find((contact) => contact.id === id);
        setCurrentChatUser(user);
      }
    } else {
      setCurrentChatUser(null);
    }
  }, [id, contacts]);

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
    localStorage.setItem("current-chat", JSON.stringify(contact));
    navigate(`/chat/${contact.id}`);
  };

  const resetChatUser = () => {
    localStorage.removeItem("current-chat");
    navigate(`/chat`);
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
