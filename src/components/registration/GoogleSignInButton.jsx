import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const GoogleSignInButton = () => {
  const { googleSignIn } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const user = await googleSignIn();
      toast.success("Google Login Successful!", { position: "top-center", autoClose: 2000 });
      console.log("Logged in User:", user);
      navigate("/user-dashboard");
    } catch (err) {
      toast.error("Google Login Failed. Try again.", { position: "bottom-center", autoClose: 2000 });
      console.error("Google Sign-In Error:", err);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-3
        bg-[#1E293B]/80 backdrop-blur-md 
        text-[#F1F5F9] font-medium
        border border-[#38BDF8]/20 rounded-lg
        py-3 px-4
        hover:bg-[#1E293B]/90 
        focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50
        transform transition-all duration-300 hover:scale-[1.02]
        shadow-lg shadow-[#38BDF8]/10"
    >
      <FcGoogle className="text-2xl" />
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleSignInButton;