import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProfileStyles.css';
import defaultProfilePic from '../assets/Default_pfp.png';

function Profile() {
    const { id } = useParams(); // Get the user id from the URL
    const [name, setName] = useState('');
    const [interests, setInterests] = useState([]);
    const [personality, setPersonality] = useState({});
    const [bio, setBio] = useState('');
    const [keyQuestions, setKeyQuestions] = useState([]);
    const [profilePic, setProfilePic] = useState(defaultProfilePic);

    useEffect(() => {
        // Fetch user data from API
        fetch(`https://find-a-friend-api-e4mude5lfq-uc.a.run.app/user/${id}`)
            .then(response => response.json())
            .then(data => {
                setName(data.name);
                setInterests(data.interests);
                setPersonality(data.personality);
                setBio(data.bio);
                setKeyQuestions(data.key_questions); 
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    const handleImageChange = (e) => {
        setProfilePic(URL.createObjectURL(e.target.files[0]));
    };

    return (
        <div className='profile'>
            <div className="profile-header">
                <h2>Profile</h2>
            </div>
            <div className="profile-content">
                <div className="profile-image">
                    <img src={profilePic} alt="Profile" />
                    <div className="profile-pic-button-container">
                        <input type="file" id="profile-pic-input" onChange={handleImageChange} hidden />
                        <label htmlFor="profile-pic-input" className="profile-pic-button">Change Profile Picture</label>
                    </div>
                </div>
                <div className="profile-details">
                    <h3>{name}</h3>
                    <p>Interests:
                        <ul>
                            {interests.map(interest => (
                                <li key={interest.interest}>{`${interest.interest} (Intensity: ${interest.intensity}, Skill: ${interest.skill})`}</li>
                            ))}
                        </ul>
                    </p>
                    <p>Personality:
                        <ul>
                            {Object.entries(personality).map(([key, value]) => (
                                <li key={key}>{`${key}: ${value}`}</li>
                            ))}
                        </ul>
                    </p>
                    <p>Bio:
                        <ul>
                            {bio.split('. ').map((sentence, index) => (
                                <li key={index}>{sentence}</li>
                            ))}
                        </ul>
                    </p>
                    <p>Key Questions:
                        <ul>
                            {keyQuestions.map((question, index) => (
                                <li key={index}>{question}</li>
                            ))}
                        </ul>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
