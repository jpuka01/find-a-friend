import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Contacts from '../components/Contacts';
import NavBarMessages from '../components/NavBarMessages';
import { useNavigate } from 'react-router-dom';

function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
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
        const { data } = await axios.get(`${process.env.REACT_APP_API_HOST_URI}/user/${currentUser.id}/matches`);
        setContacts(data);
      };
      fetchContacts();
    }
  }, [currentUser]);

  const handleChatChange = (contact) => {
    navigate(`/chat/${contact.id}`);
  };

  return (
    <div className="contacts-page-container">
      <NavBarMessages currentUser={currentUser} />
      <Contacts
        contacts={contacts}
        currentUser={currentUser}
        changeChat={handleChatChange}
      />
    </div>
  );
}

export default ContactsPage;
