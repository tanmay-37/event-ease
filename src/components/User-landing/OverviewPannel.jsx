import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";

const OverviewPanel = () => {
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const { user } = UserAuth(); 

  useEffect(() => {
    if (!user) return;

    const fetchOverviewData = async () => {
      try {
        // Get user's registrations
        const registrationsQuery = query(
          collection(db, "registrations"), 
          where("userId", "==", user.uid)
        );
        const registrationsSnap = await getDocs(registrationsQuery);
        setTotalRegistered(registrationsSnap.size);

        // Check upcoming events
        let upcomingCount = 0;
        const now = new Date();

        for (const regDoc of registrationsSnap.docs) {
          const regData = regDoc.data();
          if (!regData.eventId) continue;

          // Get the event document directly
          const eventDoc = await getDoc(doc(db, "events", regData.eventId));
          if (eventDoc.exists()) {
            const eventData = eventDoc.data();
            const eventDateTime = new Date(`${eventData.startDate} ${eventData.startTime}`);
            
            if (eventDateTime > now) {
              upcomingCount++;
            }
          }
        }

        setUpcomingEvents(upcomingCount);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };

    fetchOverviewData();
  }, [user]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-3">Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-100 rounded-lg">
          <h3 className="text-lg font-semibold">Total Events Registered</h3>
          <p className="text-2xl font-bold">{totalRegistered}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <p className="text-2xl font-bold">{upcomingEvents}</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;