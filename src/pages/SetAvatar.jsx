import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const Buffer = require("buffer").Buffer;
export default function SetAvatar() {
  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      console.log("Selected:", avatars[selectedAvatar]);
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      await axios.post(`${process.env.REACT_APP_API_HOST_URI}/set-icon`, {
        id: user.id,
        icon: `data:image/svg+xml;base64,${avatars[selectedAvatar]}`,
      });

      user.avatar = `data:image/svg+xml;base64,${avatars[selectedAvatar]}`;
      localStorage.setItem("chat-app-user", JSON.stringify(user));
      navigate("/chat");
    }
  };

  useEffect(() => {
    async function fetchData() {
      const data = [];
      for (let i = 0; i < 1; i++) {
        try {
          const image = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`
          );
          //const image = await axios.get("https://api.multiavatar.com/Binx Bond")
          const buffer = new Buffer(image.data);
          data.push(buffer.toString("base64"));
          data.push(buffer.toString("base64"));
          data.push(buffer.toString("base64"));
          data.push(buffer.toString("base64"));
        } catch (e) {
          console.log(e);
        }
      }

      setAvatars(data);
      setIsLoading(false);
    }
    fetchData();
  }, []); // Or [] if effect doesn't need props or state

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1> Pick an avatar as your profile picture</h1>
          </div>

          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>

          <button className="submit-btn" onClick={setProfilePicture}>
            Set as Profile Picture.
          </button>
        </Container>
      )}
      ;
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
