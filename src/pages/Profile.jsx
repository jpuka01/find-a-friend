import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import classNames from "./ProfileStyles.module.css";
import DefaultAvatar from "../assets/Default_pfp.png";
import loader from "../assets/loader.gif";

const PERSONALITY_EMOJIS = {
  extroversion: ["🙈", "🤫", "😊", "😀", "🎉"],
  agreeableness: ["🐉", "🐺", "🐶", "🐑", "🦄"],
  conscientiousness: ["🧺", "📝", "📋", "📅", "🏆"],
  neuroticism: ["🧊", "🌫️", "☁️", "🌧️", "🌪️"],
  openness: ["📦", "🗃️", "📖", "🌐", "🚀"],
};

const PERSONALITY_DESCRIPTIONS = {
  extroversion: [
    "Prefers solitude, finds comfort in quiet environments",
    "Reserved, enjoys time alone but occasionally socializes",
    "Comfortable in social settings, balances solitude and social activities",
    "Enjoys engaging with others, often takes initiative in social situations",
    "Thrives in social interactions, frequently seeks out gatherings and enjoys being the center of attention",
  ],
  agreeableness: [
    "Highly independent, often challenges others, values self-expression",
    "Assertive, stands firm in beliefs, willing to compromise when necessary",
    "Cooperative, generally gets along well with others",
    "Compassionate, consistently kind and helpful towards others",
    "Extremely empathetic, always puts others first, strives for harmony",
  ],
  conscientiousness: [
    "Prefers spontaneity over planning, may overlook details",
    "Somewhat organized, tries to plan ahead but can be flexible",
    "Reliably meets obligations, maintains a balance of order and flexibility",
    "Thoroughly organized, plans meticulously and values structure",
    "Exceptionally diligent, always follows through and exceeds expectations",
  ],
  neuroticism: [
    "Has a calming presence, effortlessly maintains composure under stress",
    "Typically relaxed, gracefully navigates occasional emotional disturbances",
    "Emotionally responsive, embraces a wide spectrum of feelings with understanding",
    "Sensitive to stress but actively seeks ways to regain balance and comfort",
    "Deeply emotional towards self and others, regularly navigates intense emotions with care",
  ],
  openness: [
    "Prefers routine, values traditional approaches over new ones",
    "Somewhat open to new ideas, but generally prefers familiar situations",
    "Appreciates new experiences, often explores different perspectives",
    "Eagerly seeks new ideas and enjoys discovering different cultures and concepts",
    "Highly imaginative and creative, embraces novel ideas and complex challenges",
  ],
};

function PersonalityTrait({ trait, level }) {
  return (
    <div className={classNames["personality-trait-container"]}>
      <div className={classNames["personality-trait"]}>
        <div>
          <p title={PERSONALITY_DESCRIPTIONS[trait][Math.round(level) - 1]}>
            <span className={classNames["personality-trait-emoji"]}>
              {PERSONALITY_EMOJIS[trait][Math.round(level) - 1]}
            </span>
            <span className={classNames["personality-trait-name"]}>
              {trait.charAt(0).toUpperCase() + trait.slice(1)}
            </span>
          </p>
        </div>
      </div>
      <div
        className={classNames["personality-trait-bar"]}
        style={{ width: `${Math.max(level * 20, 5)}%` }}
      ></div>
    </div>
  );
}

function Tag({ tag, emoji }) {
  return (
    <div class={classNames["chip"]}>
      <div class={classNames["chip-head"]}>{emoji}</div>
      <div class={classNames["chip-content"]}>{tag}</div>
    </div>
  );
}

function Interest({ interest, emoji, level }) {
  return (
    <div className={classNames["interest-container"]}>
      <div className={classNames["interest"]}>
        <p>
          <span>{emoji}</span> {interest}
        </p>
      </div>
      <div
        className={classNames["interest-bar"]}
        style={{ width: `${level * 100}%` }}
      ></div>
    </div>
  );
}

function Profile() {
  const [status, setStatus] = useState("loading");
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("chat-app-user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HOST_URI}/user/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
        setStatus("loaded");
      })
      .catch((error) => console.error("Error:", error));
  }, [id]);

  const [showFullBio, setShowFullBio] = useState(false);
  const [showFullInterests, setShowFullInterests] = useState(false);

  const bioSentences = useMemo(() => {
    if (!profile.profile) return "";
    if (showFullBio) {
      return profile.profile.bio;
    } else {
      return profile.profile.bio.split(".").slice(0, 3).join(".") + ".";
    }
  }, [profile, showFullBio]);

  const sortedInterests = useMemo(() => {
    if (!profile.profile) return [];
    return profile.profile.interests.sort((a, b) => b.level - a.level);
  }, [profile]);

  if (status === "loading") {
    return (
      <div className={classNames["profile-page"]}>
        <NavBar />
        <div className={classNames["loading-content"]}>
          <div className={classNames["loading-internal"]}>
            <h1 className={classNames["loading-title"]}>Loading...</h1>
            <p className={classNames["loading-text"]}>
              Please wait while we fetch the profile. This should only take a
              few minutes. Do not refresh the page.
            </p>

            <img src={loader} alt="loader" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={classNames["profile-page"]}>
      <NavBar />
      <div className={classNames["profile-content"]}>
        <div className={classNames["profile-sidebar"]}>
          <div className={classNames["profile-image-container"]}>
            <div className={classNames["profile-image"]}>
              <img src={profile.avatar || DefaultAvatar} alt="Profile" />
            </div>
          </div>
          <h2 className={classNames["profile-name"]}>{profile.name}</h2>
          <h6 className={classNames["profile-subtitle"]}>
            {profile.profile.subtitle}
          </h6>

          <div>
            {profile.profile.tags.map((tag, index) => (
              <Tag key={index} tag={tag.tag} emoji={tag.emoji} />
            ))}
          </div>
          <div className={classNames["section"]}>
            <h4>I'm looking for...</h4>
            <p>{profile.profile.looking_for}</p>
          </div>
          {id !== currentUser.id && (
            <div className={classNames["chat-button-container"]}>
              <button
                className={classNames["chat-button"]}
                onClick={() => navigate(`/chat/${id}`)}
              >
                Start a conversation
              </button>
            </div>
          )}
        </div>
        <div className={classNames["profile-details"]}>
          <div className={classNames["section"]}>
            <h3>About me...</h3>
            <p>
              {bioSentences}
              <button
                class={classNames["show-more"]}
                onClick={() => setShowFullBio((more) => !more)}
              >
                {showFullBio ? "Less" : "More"}
              </button>
            </p>
          </div>
          <hr />
          <div className={classNames["section"]}>
            <h3>I'm interested in...</h3>
            {sortedInterests
              .slice(0, showFullInterests ? undefined : 5)
              .map((interest, index) => (
                <Interest
                  key={index}
                  interest={interest.interest}
                  emoji={interest.emoji}
                  level={interest.level}
                />
              ))}
            <button
              className={classNames["show-more"]}
              onClick={() => setShowFullInterests((prev) => !prev)}
            >{`${showFullInterests ? "Less" : "More"}`}</button>
          </div>
          <hr />

          <div className={classNames["section"]}>
            <h3>In my free time, I enjoy...</h3>
            <ul className={classNames["hobbies"]}>
              {profile.profile.hobbies.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>

          <hr />

          <div className={classNames["section"]}>
            <h3>My personality...</h3>
            {Object.entries(profile.profile.personality).map(
              ([key, value], index) => (
                <PersonalityTrait key={index} trait={key} level={value} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
