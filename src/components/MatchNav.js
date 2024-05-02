import React, { useState } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import Logout from "../components/Logout";
import { FaWhatsapp } from "react-icons/fa";

import "./MatchNavStyles.css";

function MatchNav() {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className={nav ? "navbar navbar-bg" : "navbar"}>
      <div className="title">
        <h2>Match</h2>
      </div>
      <ul className="nav-menu">
      </ul>
      <div className="hamburger" onClick={handleNav}>
        <HiOutlineMenuAlt4 className="icon" />
      </div>
      <div className={nav ? "mobile-menu active" : "mobile-menu"}>
        <ul className="mobile-nav">
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

export default MatchNav;
