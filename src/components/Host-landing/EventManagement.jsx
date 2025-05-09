import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EditEventForm from "../EventForm/EditEventForm";

const EventManagement = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [currentEvents, setCurrentEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchAllEvents = async () => {
      try {
        // Fetch current events with registration counts
        const currentEventsQuery = query(
          collection(db, "events"),
          where("userId", "==", user.uid)
        );
        const currentEventsSnap = await getDocs(currentEventsQuery);
        
        const currentEventsList = await Promise.all(
          currentEventsSnap.docs.map(async (doc) => {
            const registrationsQuery = query(
              collection(db, "registrations"),
              where("eventId", "==", doc.id)
            );
            const registrationsSnap = await getDocs(registrationsQuery);
            
            return {
              id: doc.id,
              ...doc.data(),
              registrationCount: registrationsSnap.size
            };
          })
        );
        setCurrentEvents(currentEventsList);

        // Fetch completed events
        const completedEventsQuery = query(
          collection(db, "recentEvents"),
          where("userId", "==", user.uid)
        );
        const completedEventsSnap = await getDocs(completedEventsQuery);
        
        const completedEventsList = completedEventsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isCompleted: true
        }));
        setCompletedEvents(completedEventsList);

      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, [user]);

  const handleEventUpdate = (updatedEventData) => {
    setCurrentEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === editingEvent.id
          ? { ...event, ...updatedEventData }
          : event
      )
    );
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Events Hosted</h2>
        <button 
          onClick={() => navigate("/my-created-events")} 
          className="text-[#A084E8] hover:text-[#8C72D4] font-semibold"
        >
          View All →
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : currentEvents.length === 0 && completedEvents.length === 0 ? (
        <p className="text-gray-500">No events created yet</p>
      ) : (
        <div className="space-y-4">
          {/* Current Events */}
          {currentEvents.slice(0, 3).map(event => (
            <div key={event.id} 
              className="p-4 bg-indigo-100 rounded-lg flex justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#4A3F74]">{event.title}</h3>
                <span className="text-sm font-medium text-[#6B7280]">
                  {event.registrationCount || 0} registrations
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="text-[#A084E8] hover:text-[#8C72D4] font-medium px-2 py-1 rounded"
                >
                  Edit
                </button>
                <span className="text-green-700 bg-green-100 px-3 py-1 rounded-lg text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          ))}

          {/* Completed Events */}
          {completedEvents.slice(0, 3).map(event => (
            <div key={event.id} 
              className="p-4 bg-indigo-100 rounded-lg flex justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#4A3F74]">{event.title}</h3>
                <span className="text-sm font-medium text-[#6B7280]">
                  {event.registrationCount || 0} registrations
                </span>
              </div>
              <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium">
                Completed
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventForm
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onUpdate={handleEventUpdate}
        />
      )}
    </div>
  );
};

export default EventManagement;