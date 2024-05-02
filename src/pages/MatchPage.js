import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import DefaultIcon from "../assets/Default_pfp.png";
import "./MatchPageStyles.css";
import MatchNav from "../components/MatchNav";

// Component to display match details
function MatchCard({ match }) {
  const [showFullReason, setShowFullReason] = useState(false);

  const truncatedReason = match.reason
    ? match.reason.substring(0, 300) +
      (match.reason.length > 100 && !showFullReason ? "..." : "")
    : "No reason provided";

  console.log(match);
  return (
    <div className="match-card">
      <Link to={`/user/${match.id}`}>
        <img src={match.avatar || DefaultIcon} alt={`${match.name}'s avatar`} />
      </Link>
      <h2>You matched with {match.name || "Unknown"}!</h2>
      <div className="match-reason">
        <p>{showFullReason ? match.reason : truncatedReason}</p>
        {match.reason && match.reason.length > 300 && (
          <button
            className="expand-button"
            onClick={() => setShowFullReason(!showFullReason)}
          >
            {showFullReason ? "Show less" : "Show more"}
          </button>
        )}
      </div>
      <Link to={`/chat/${match._id}`}>
        <button className="chat-button">Start a conversation</button>
      </Link>
      <Link to={`/user/${match.id}`}>
        <button className="profile-button">Visit their profile</button>
      </Link>
    </div>
  );
}

const emojis = ["🔥", "🎉", "💥", "✨", "🌟"];

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
                avatar: userData.avatar,
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

  useEffect(() => {
    if (loaded) {
      // Only start the emoji effect if the page is loaded
      const intervalId = setInterval(() => {
        const emoji = document.createElement("div");
        emoji.className = "emoji";
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * window.innerWidth + "px";
        document.body.appendChild(emoji);
        setTimeout(() => {
          document.body.removeChild(emoji);
        }, 2000); // Remove after 2 seconds
      }, 200); // Create a new emoji every 200ms
      const timeoutId = setTimeout(() => clearInterval(intervalId), 2000); // Stop creating emojis after 2 seconds
      return () => {
        clearInterval(intervalId); // Clean up on component unmount
        clearTimeout(timeoutId); // Also clean up the timeout
      };
    }
  }, [loaded]);

  if (!loaded) {
    return <div>Loading...</div>;
  } else if (loaded) {
    return (
      <div>
        <MatchNav />
        <div className="match-page">
          <MatchCard match={match} />
        </div>
      </div>
    );
  }
}

export default Match;
