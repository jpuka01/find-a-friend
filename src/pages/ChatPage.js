import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ChatContainer from '../components/ChatContainer';
import ChatNav from '../components/ChatNav';

function ChatPage() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [toUser, setToUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("chat-app-user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(storedUser));
      fetchUserDetails(id);
    }
  }, [id]);

  const fetchUserDetails = async (userId) => {
    const response = await axios.get(`${process.env.REACT_APP_API_HOST_URI}/user/${userId}`);
    setToUser(response.data);
  };

  return (
    <div className="chat-page-container">
      {currentUser && toUser && (
        <>
          <ChatNav currentUser={currentUser} currentChatUser={toUser} />
          <ChatContainer toUser={toUser} currentUser={currentUser} />
        </>
      )}
    </div>
  );
}

export default ChatPage;
