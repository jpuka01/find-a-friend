// LandingPage.js

import React from 'react'
import { Link } from 'react-router-dom';

import './LandingPageStyles.css';

function LandingPage() {
  return (
    
    <div className='landing-page'>
        <div className='logo'>
            <h2>FIND-A-FRIEND</h2>
        </div>
        <div className='content'>
            <p>"Connect Beyond Borders"</p>
        </div>
        <div className='value-proposition'>
            <p>Discover friendship and learning through AI-powered connections!</p>
        </div>
        <Link to='/register' className='get-started'>Get Started</Link>
    </div>
  )
}

export default LandingPage