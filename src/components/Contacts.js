import React, { useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ContactsStyles.css"; // CSS for Contacts
import AiIcon from "../assets/openai.svg";
import FindMatch from "./FindMatch";
import DefaultIcon from "../assets/Default_pfp.png";

function Contacts({ contacts, currentUser, changeChat }) {
  const [matchStatus, setMatchStatus] = useState(null);
  const navigate = useNavigate();

  const matchUser = useCallback(() => {
    setMatchStatus("loading");
    fetch(
      `${process.env.REACT_APP_API_HOST_URI}/user/${currentUser.id}/matches`,
      { method: "POST" }
    )
      .then((response) => response.json())
      .then((data) => {
        navigate(`/match/${data.id}`);
      })
      .catch((error) => {
        setMatchStatus("error");
        console.error("Error:", error);
      });
  }, [currentUser, navigate]);

  return (
    <div className="contacts-container">
      {matchStatus != null && (
        <FindMatch
          error={matchStatus === "error"}
          onClose={() => setMatchStatus(null)}
        />
      )}
      {currentUser && (
        <div className="current-user-info">
          <Link to={`/user/${currentUser.id}`}>
            <img
              className="current-user-avatar"
              src={currentUser.avatar ? currentUser.avatar : DefaultIcon}
              alt="Current user"
            />
          </Link>
          <h3 className="current-user-name">{currentUser.name || "No Name"}</h3>
          <button onClick={matchUser}>Find a Friend</button>
        </div>
      )}
      <div className="contacts-list">
        <div
          className="contact-item"
          onClick={() =>
            changeChat({
              id: "00000000-0000-0000-0000-000000000000",
              name: "Agent",
            })
          }
        >
          <img src={AiIcon} alt="Agent" />
          <div>Agent</div>
        </div>
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="contact-item"
            onClick={() => changeChat(contact)}
          >
            <img
              src={contact.avatar || DefaultIcon}
              alt={`${contact.username}'s avatar`}
            />
            <div>{contact.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contacts;
