import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { BsPerson } from 'react-icons/bs'
import { HiOutlineMenuAlt4 } from 'react-icons/hi'
// import { AiOutlineClose } from 'react-icons/ai'
import { FaWhatsapp } from 'react-icons/fa'

import './NavBarStyles.css'

function Navbar() {
    const [nav, setNav] = useState(false)
    const handleNav = () => setNav(!nav)

    return (
        <div name='home' className={nav ? 'navbar navbar-bg' : 'navbar'}>
            <div className="title">
                <h2>Profile</h2>
            </div>
            <ul className="nav-menu">
                <li>Matches</li>
                <li>Messages</li>
                <li>Settings</li>
            </ul>
            <div className="nav-icons">
                <BiSearch className='icon' style={{ marginRight: '1rem' }} />
                <BsPerson className='icon' />
            </div>
            <div className="hamburger" onClick={handleNav}>
                <HiOutlineMenuAlt4 className="icon" />
            </div>
            <div className={nav ? 'mobile-menu active' : 'mobile-menu'}>
                <ul className="mobile-nav">
                    <li>Matches</li>
                    <li>Messages</li>
                    <li>Settings</li>
                </ul>
                <div className="mobile-menu-bottom">
                    <div className="menu-icons">
                        <button>Log Out</button>
                    </div>
                    <div className="social-icons">
                        <a href="https://web.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className="icon" />
                        </a>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Navbar