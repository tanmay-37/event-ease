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
      <div className="h-16"> {/* Spacer div */}
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 fixed w-full top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Hamburger Menu (Mobile) */}
              <button
                className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md p-2"
                onClick={() => setIsMenuOpen(true)}
                aria-expanded={isMenuOpen}
              >
                <Menu size={24} />
              </button>

              {/* Center: Logo */}
              <div className="flex-shrink-0">
                <Link to="/">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="h-10 w-auto transition-transform hover:scale-105" 
                  />
                </Link>
              </div>

              {/* Middle: Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/discover">View Events</NavLink>
              </div>

              {/* Right: Profile Section */}
              <div className="relative flex items-center" ref={profileRef}>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="flex items-center space-x-3 group focus:outline-none rounded-full hover:bg-gray-100 p-1 transition-all duration-200"
                    >
                      <img 
                        src={userLogo} 
                        alt="User Logo" 
                        className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-purple-500 transition-all duration-200" 
                      />
                      <span className="text-gray-700 hidden md:block font-medium group-hover:text-purple-600 transition-colors pr-2">
                        {user.displayName || "User"}
                      </span>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {profileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-lg overflow-hidden shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1">
                          <DropdownLink 
                            to={isHost ? "/host-dashboard" : "/user-dashboard"}
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            Dashboard
                          </DropdownLink>
                          <DropdownLink 
                            to="/my-profile"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            View Profile
                          </DropdownLink>
                          <button
                            onClick={() => {
                              logout();
                              setProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                  >
                    Login/SignUp
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm transition-opacity z-40" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-out z-50`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col py-4">
          <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/discover" onClick={() => setIsMenuOpen(false)}>
            View Events
          </MobileNavLink>
        </div>
      </div>
    </>
  );
};

// Helper Components
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-purple-600 after:transition-all"
  >
    {children}
  </Link>
);

const DropdownLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="px-6 py-3 text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
  >
    {children}
  </Link>
);

export default Navbar;