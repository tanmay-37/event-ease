import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";

const OverviewPanel = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0
  });
  const { user } = UserAuth();

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // Fetch current events and their registrations
        const currentEventsQuery = query(
          collection(db, "events"),
          where("userId", "==", user.uid)
        );
        const currentEventsSnap = await getDocs(currentEventsQuery);
        
        // Fetch completed events
        const completedEventsQuery = query(
          collection(db, "recentEvents"),
          where("userId", "==", user.uid)
        );
        const completedEventsSnap = await getDocs(completedEventsQuery);

        // Calculate total events
        const totalEvents = currentEventsSnap.size + completedEventsSnap.size;

        // Calculate total registrations
        let totalRegistrations = 0;

        // Count registrations from current events
        for (const doc of currentEventsSnap.docs) {
          const registrationsQuery = query(
            collection(db, "registrations"),
            where("eventId", "==", doc.id)
          );
          const registrationsSnap = await getDocs(registrationsQuery);
          totalRegistrations += registrationsSnap.size;
        }

        // Add registrations from completed events
        for (const doc of completedEventsSnap.docs) {
          // Use the stored registrationCount for completed events
          const eventData = doc.data();
          totalRegistrations += eventData.registrationCount || 0;
        }

        setStats({
          totalEvents,
          totalRegistrations
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="p-6 bg-white/30 backdrop-blur-lg shadow-lg border border-white/30 rounded-2xl">
      <h2 className="text-xl font-semibold text-[#4A3F74] mb-4">Dashboard Overview</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-purple-100 rounded-lg">
          <h3 className="text-lg font-semibold text-[#4A3F74]">Total Events</h3>
          <p className="text-2xl font-bold text-[#6a5ba7]">{stats.totalEvents}</p>
        </div>
        
        <div className="p-4 bg-purple-100 rounded-lg">
          <h3 className="text-lg font-semibold text-[#4A3F74]">Total Registrations</h3>
          <p className="text-2xl font-bold text-[#6a5ba7]">{stats.totalRegistrations}</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;