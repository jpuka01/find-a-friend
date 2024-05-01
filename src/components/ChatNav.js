import React, { useState } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import Logout from "./Logout";
import { FaWhatsapp } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AiIcon from "../assets/openai.svg";
import DefaultAvatar from "../assets/Default_pfp.png";

import "./ChatNavStyles.css";

function ChatNav({
  currentUser,
  currentChatUser,
  showReturnButton,
  onReturnClick,
  chat,
}) {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();

  const handleNav = () => {
    setNav(!nav);
  };

  const handleReturn = () => {
    onReturnClick();
    navigate("/chat");
  };

  return (
    <div className={nav ? "navbar navbar-bg" : "navbar"}>
      <div className="title">
        {showReturnButton && (
          <button onClick={handleReturn} className="return-button">
            <FaArrowLeft />
          </button>
        )}
        <Link
          to={
            currentChatUser.id === "00000000-0000-0000-0000-000000000000"
              ? null
              : `/user/${currentChatUser.id}`
          }
        >
          <div
            className="current-user-info"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              className="chat-nav-avatar"
              src={
                currentChatUser.id === "00000000-0000-0000-0000-000000000000"
                  ? AiIcon
                  : currentChatUser.avatar
                  ? currentChatUser.avatarImage
                  : DefaultAvatar
              }
              alt="Current user"
            />
            <h3 className="chat-nav-name">
              {currentChatUser.name || "No Name"}
            </h3>
          </div>
        </Link>
        <div style={{ width: 50, visibility: "hidden" }}> </div>
      </div>
      <ul className="nav-menu">
        <li>
          <Link to={`/user/${currentUser.id}`}> My Profile</Link>
        </li>
      </ul>
      <div className="hamburger" onClick={handleNav}>
        <HiOutlineMenuAlt4 className="icon" />
      </div>
      <div className={nav ? "mobile-menu active" : "mobile-menu"}>
        <ul className="mobile-nav">
          <Link to="/matches">
            <li>Matches</li>
          </Link>

          <Link to={`/user/${currentUser.id}`}>
            <li>My Profile</li>
          </Link>
        </ul>
        <div className="mobile-menu-bottom">
          <div className="menu-icons">
            <Logout />
          </div>
          <div className="social-icons">
            <a
              href="https://web.whatsapp.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatNav;
