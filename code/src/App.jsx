// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "./assets/style.css";
import Header from "./components/header/Header";
import Market from "./components/header/market/market";
import CardWin from "./components/cardWin/CardWin";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Market />} />
        <Route path="/cardwin/:id" element={<CardWin />} />
      </Routes>
    </Router>
  );
};

export default App;
