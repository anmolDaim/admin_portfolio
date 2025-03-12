import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Authenticate user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is an admin in Firestore
      const adminRef = doc(db, "blogs", user.email);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists() && adminSnap.data().role === "admin") {
        // Redirect to Dashboard if admin
        navigate("/");
      } else {
        setError("Access Denied: You are not an admin!");
      }
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container mx-auto max-w-100">
      <h2 className="font-bold text-3xl text-white text-center m-10 ">Admin Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col justify-center item-center">
        <input className="rounded p-3 m-3 text-white bg-gray-700" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="rounded p-3 m-3 text-white bg-gray-700" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-gradient-to-r from-indigo-500 from-10% via-purple-500 via-30% to-pink-500 to-90% py-3 px-10 m-8 rounded-md font-bold" type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
