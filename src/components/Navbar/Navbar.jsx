import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";  
import logo from "../../assets/logo.png";
import userLogo from "../../assets/Userlogo.webp";
import { EventContext } from "../../context/EventContext";
import { UserAuth } from "../../context/AuthContext";

const Navbar = () => {
  const eventContext = useContext(EventContext);
  const { user, userType, logout } = UserAuth();
  const isHost = userType === "host";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  if (!eventContext) {
    console.error("Navbar must be used within an EventProvider");
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Mobile Menu Button */}
            <div className="flex-shrink-0 -mr-2 md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <img src={logo} className="h-12 w-auto" alt="EventEase Logo" />
              </Link>
            </div>

            {/* Middle: Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" 
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Home
              </Link>
              <Link to="/discover" 
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                View Events
              </Link>
            </div>

            {/* Right: Profile Section */}
            <div className="flex items-center" ref={profileRef}>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 focus:outline-none"
                  >
                    <img src={userLogo} alt="Profile" className="w-10 h-10 rounded-full border-2 border-purple-200" />
                    <span className="hidden md:block text-sm font-medium">{user.displayName || "User"}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          to={isHost ? "/host-dashboard" : "/user-dashboard"}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/my-profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                >
                  Login/SignUp
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
               onClick={() => setIsMenuOpen(false)} />
          
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                <img src={logo} className="h-8 w-auto" alt="EventEase Logo" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 px-4 py-6 space-y-6">
                <Link
                  to="/"
                  className="block text-base font-medium text-gray-900 hover:text-purple-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/discover"
                  className="block text-base font-medium text-gray-900 hover:text-purple-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;