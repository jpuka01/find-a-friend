import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./LoginStyles.css";

function Login() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      console.log("in validation");
      /* using axios to send a register route post request */
      /* will be processed in userRoutes.js (server side) */
      const { password, username } = values;
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_HOST_URI}/login`,
        {
          username,
          password,
        }
      );

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }

      if (true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data));
        navigate("/chat");
      }
    }
  };

  const handleValidation = () => {
    //key matching
    const { password, username } = values;

    if (username === "") {
      toast.error("Please enter a username.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Please enter a password.", toastOptions);
      return false;
    }

    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <div className="container">
      {/* When button with type = "submit" is clicked, call handleSubmit */}
      <form
        className="form-container"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className="brand">
          <h1>Find-A-Friend</h1>
        </div>
        {/* min is the minimum length */}
        <input
          className="user"
          type="text"
          placeholder="Username"
          name="username"
          onChange={(e) => handleChange(e)}
          min="3"
        />
        <input
          className="pass"
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => handleChange(e)}
        />

        <button className="submit-button" type="submit">
          {" "}
          Login{" "}
        </button>
        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
