import React from "react"
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../src/Components/Dashboard";
import LoginPage from "../src/Components/LoginPage";


function App() {

  return (
    <Router>
      <Routes>
       {/* Redirect from "/" to "/login" */}
       <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard (should only be accessible after login) */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
