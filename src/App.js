import "./css/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.js";
import Chat from "./Chat.js";
import Login from "./login.js";
import Stories from "./stories.js";
import Signup from "./signup.js";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
const App = () => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("id", user.uid);
      } else {
      }
    });
  });
  return (
    <div className="App">
      <BrowserRouter basename={"/"}>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/chat" element={<Chat />} />
          <Route exact path="/stories" element={<Stories />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
