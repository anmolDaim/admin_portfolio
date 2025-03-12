import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../src/Components/Dashboard";
import LoginPage from "../src/Components/LoginPage";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
