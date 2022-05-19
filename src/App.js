import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import setAuthToken from "./helpers/setAuthToken";
import "./style.scss";

function App() {
  const token = localStorage.getItem("token");

  if (token) {
    setAuthToken(token);
  }

  return (
    <BrowserRouter basename="/kanban-board">
      <Routes>
        <Route
          exact
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/signup"
          element={<SignupPage />}
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
