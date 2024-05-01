import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./RegisterStyles.css";

function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      console.log("in validation");
      /* using axios to send a register route post request */
      /* will be processed in userRoutes.js (server side) */
      const { password, username } = values;
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_HOST_URI}/register`,
        {
          name: username,
          username,
          password,
        }
      );

      localStorage.setItem("chat-app-user", JSON.stringify(data));
      // navigate("/chat");
      navigate("/setAvatar");
    }
  };

  const handleValidation = () => {
    //key matching
    const { password, confirmPassword, username } = values;

    if (username === "") {
      toast.error("Please enter a username.", toastOptions);
      return false;
    } else if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
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
    <>
      <div className="formContainer">
        <form className="form-page" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <h1>Find-A-Friend</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />

          <button className="register-button" type="submit">
            {" "}
            Create User{" "}
          </button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Register;
