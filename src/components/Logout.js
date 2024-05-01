import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutStyles.css'; 

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className="log-out-button">
            Log Out
        </button>
    );
}

export default Logout;
