// NavBar.js

import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsPerson } from 'react-icons/bs'
import { HiOutlineMenuAlt4 } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { Link } from 'react-router-dom';

import './NavBarStyles.css'

function NavBar() {
    const [nav, setNav] = useState(false)
    const handleNav = () => setNav(!nav)
    const [message, setMessage] = useState('');
    const messages = ['Hello', 'Hi', 'Welcome']; // Mock messages

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(message);
        setMessage('');
    };

    return (
        <div className='navbar'>
            <div className="logo">
                <h2>FIND-A-FRIEND</h2>
            </div>
            <ul className="nav-menu">
                <li><Link to="/profile">Profile</Link></li>
                <li>Messages</li>
                <li>Settings</li>
                =        </ul>
            <div className="nav-icons">
                <BiSearch className='icon' style={{ marginRight: '1rem' }} />
                <BsPerson className='icon' />
            </div>
            <div className="hamburger" onClick={handleNav} >
                <HiOutlineMenuAlt4 className='icon' />
            </div>
            <div className={nav ? 'mobile-menu active' : 'mobile-menu'}>
                <ul className="mobile-nav">
                    <li><Link to="/profile">Profile</Link></li>
                    <li>Messages</li>
                    <li>Settings</li>
                </ul>
                <div className="mobile-menu-bottom">
                    <div className="menu-icons">
                        <button>Log Out</button>
                    </div>
                    <div className="social-icons">
                        <a href="https://web.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className='icon' />
                        </a>
                    </div>
                </div>
            </div>
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="message" value={message} onChange={handleChange} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default NavBar