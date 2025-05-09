import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import EventCard from "../Card";
import Logout from "../Logout";
import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import OverviewPanel from "./OverviewPannel";
import MyRegisteredEvents from "./MyRegisteredEvents";
import DiscoverBtn from "./DiscoverBtn";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchUserEvents = async () => {
      try {
        // Fetch user registrations
        const registrationsQuery = query(
          collection(db, "registrations"), 
          where("userId", "==", user.uid)
        );
        const registrationsSnap = await getDocs(registrationsQuery);

        // Get all registered event IDs
        const eventIds = registrationsSnap.docs.map(doc => doc.data().eventId);

        if (eventIds.length > 0) {
          // Fetch event details for each registration
          const currentDate = new Date();
          const upcomingEventsList = [];
          
          for (const eventId of eventIds) {
            const eventDoc = await getDocs(doc(db, "events", eventId));
            if (eventDoc.exists()) {
              const eventData = eventDoc.data();
              const eventDate = new Date(`${eventData.startDate} ${eventData.startTime}`);
              
              // Check if event is upcoming
              if (eventDate > currentDate) {
                upcomingEventsList.push({
                  id: eventDoc.id,
                  ...eventData
                });
              }
            }
          }

          // Sort upcoming events by date
          const sortedUpcomingEvents = upcomingEventsList.sort((a, b) => {
            const dateA = new Date(`${a.startDate} ${a.startTime}`);
            const dateB = new Date(`${b.startDate} ${b.startTime}`);
            return dateA - dateB;
          });

          setUpcomingEvents(sortedUpcomingEvents);
        }

        setEvents(registrationsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      } catch (error) {
        setErrorMessage("Failed to fetch events. Please try again.");
        console.error("Error fetching user events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col p-4 lg:p-6"
      style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}>
      
      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <OverviewPanel upcomingEvents={upcomingEvents} />
        <MyRegisteredEvents />
      </div>

      {/* Action buttons container */}
      <div className="w-full flex justify-center gap-4 mt-6 relative z-50 pointer-events-auto">
        <button
          onClick={() => navigate("/discover")}
          className="bg-[#A084E8] hover:bg-[#8C72D4] text-white px-6 py-2 rounded-lg font-semibold shadow-md w-full max-w-[300px] sm:w-auto"
        >
          Browse New Events
        </button>
        <button
          onClick={() => navigate("/user/recent-events")}
          className="bg-white/50 hover:bg-white/70 backdrop-blur-sm text-[#4A3F74] px-6 py-2 rounded-lg font-semibold shadow-md w-full max-w-[300px] sm:w-auto border border-[#A084E8]/30"
        >
          Recent Events
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;