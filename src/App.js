import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";
import Match from "./pages/MatchPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";
import Contacts from "./components/Contacts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/match/:id" element={<Match />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/:id" element={<Profile />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/navbar" element={<NavBar />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
