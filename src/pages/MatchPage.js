import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import './MatchPageStyles.css';
import NavBar from '../components/NavBar';

// Component to display match details
function MatchCard({ match }) {
  const [showFullBio, setShowFullBio] = useState(false);

  const truncateBio = (bio, length = 5) => {
    if (!bio || bio.length <= length) {
      return bio;
    }
    return bio.substring(0, length) + "...";
  };

  console.log(match);

  return (
    <div className="match-card">
      <h2>You matched with {match.name || 'Unknown'}!</h2>
      <div className="match-reason">
        <p>{match.reason || 'No reason provided'}</p>
        {showFullBio ? <p>{match.bio || 'No bio provided'}</p> : <p>{truncateBio(match.bio)}</p>}
        <button
          className="show-more"
          onClick={() => setShowFullBio((more) => !more)}
        >
          {showFullBio ? "Less" : "More"}
        </button>
      </div>
      <button className="chat-button">Start a conversation</button>
      <Link to={`/user/${match.id}`}>
        <button className="profile-button">Visit their profile</button>
      </Link>
    </div>
  );
}

// Main Match component
function Match() {
  const [loaded, setLoaded] = useState(false);
  const [match, setMatch] = useState({});
  const { id } = useParams(); // Get the 'id' from the route parameter

  useEffect(() => {
    // Fetch match data from API
    fetch(`${process.env.REACT_APP_API_HOST_URI}/match/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.other_id) {
          // Assuming we need to fetch additional data from another user endpoint
          fetch(`${process.env.REACT_APP_API_HOST_URI}/user/${data.other_id}`)
            .then((response) => response.json())
            .then((userData) => {
              setMatch({
                id: userData.id,
                name: userData.name, // Set the name from user data
                reason: data.reason, // Ensure the reason is directly set from match data
              });
              setLoaded(true);
            })
            .catch((error) =>
              console.error("Error fetching user data:", error)
            );
        } else {
          setMatch({
            ...data, // Use directly if no other_id is provided
            name: "User not found", // Provide a default fallback name
          });
          setLoaded(true);
        }
      })
      .catch((error) => console.error("Error fetching match data:", error));
  }, [id]); // Dependency array with 'id' to re-run effect if 'id' changes

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="match-page">
        <MatchCard match={match} />
      </div>
    </div>
  );
}

export default Match;
