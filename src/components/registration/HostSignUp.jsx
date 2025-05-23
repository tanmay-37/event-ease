import React, { useState } from "react";
import LoginUnderline from "../../assets/LoginUnderline.png";
import { Link, useNavigate } from "react-router-dom";
import reg from "../../styles";
import { UserAuth } from "../../context/AuthContext";
import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HostSignUp = () => {
  const [hostName, setHostName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnfPwd, setCnfPwd] = useState("");
  const [error, setError] = useState("");

  const { createUser } = UserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== cnfPwd) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUser(email, password);
      const host = auth.currentUser;
      if (host) {
        await setDoc(doc(db, "hosts", host.uid), {
          hostName: hostName,
          email: email,
          userType: "Host"
        });
      }
      toast.success("Host User created successfully!", {
        position: "top-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      navigate("/host-dashboard");
    } catch (err) {
      setError(err.message);
      console.log(err.message);
      toast.error(err.message, {
        position: "bottom-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0F172A] p-4">
      <div className="w-full max-w-md p-8 bg-[#1E293B]/80 backdrop-blur-md rounded-xl border border-[#38BDF8]/20">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-[#94A3B8] text-lg font-medium">Host</h2>
          <h1 className="text-3xl font-bold text-[#F1F5F9] mt-1 relative inline-block">
            Sign Up
            <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-[#38BDF8] to-[#60A5FA] rounded-full"></div>
          </h1>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Host Name"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-lg 
              text-[#F1F5F9] placeholder-[#94A3B8] 
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50
              transition duration-300"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-lg 
              text-[#F1F5F9] placeholder-[#94A3B8] 
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50
              transition duration-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-lg 
              text-[#F1F5F9] placeholder-[#94A3B8] 
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50
              transition duration-300"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={cnfPwd}
            onChange={(e) => setCnfPwd(e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A]/50 border border-[#38BDF8]/20 rounded-lg 
              text-[#F1F5F9] placeholder-[#94A3B8] 
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50
              transition duration-300"
            required
          />
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#38BDF8] to-[#60A5FA]
              text-white font-medium rounded-lg
              hover:opacity-90 transition duration-300
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50"
          >
            Sign Up
          </button>
        </form>

        {/* Login and User Signup Links */}
        <div className="mt-6 space-y-4">
          <p className="text-center text-[#94A3B8]">
            Already a Host?{" "}
            <Link 
              to="/host-login" 
              className="text-[#38BDF8] hover:text-[#60A5FA] transition duration-300"
            >
              Login
            </Link>
          </p>
          <button 
            onClick={() => navigate("/signup")} 
            className="w-full py-2 px-4 bg-[#0F172A]/50 
              text-[#F1F5F9] font-medium rounded-lg
              border border-[#38BDF8]/20
              hover:bg-[#0F172A]/70 transition duration-300
              focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50"
          >
            Are you a User?
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostSignUp;