import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import { FiUsers } from "react-icons/fi";
import Spinner from "../Spinner";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const { user, userType } = UserAuth();
  const isHost = userType === "host";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such event!");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkRegistration = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "registrations"),
          where("eventId", "==", id),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsRegistered(true);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    };

    fetchEvent();
    checkRegistration();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-700 text-lg">Event not found.</p>
      </div>
    );
  }

  return (
    <div
      className="p-10 min-h-screen bg-purple-100"
      style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
        <div className="w-full max-h-96 flex justify-center items-center overflow-hidden rounded-xl">
          <img src={event.image} alt="Event" className="w-auto h-auto max-w-full max-h-96 object-contain" />
        </div>

        <h2 className="text-4xl font-extrabold mt-6 text-gray-800">{event.title}</h2>

        <p className="text-gray-700 mt-4 leading-relaxed whitespace-pre-line">{event.description}</p>

        <div className="mt-4 text-gray-600 text-lg font-semibold space-y-2">
          <p>📅 {event.endDate ? `${event.startDate} - ${event.endDate}` : event.startDate}</p>
          <p>📍 {event.venue}</p>
        </div>

        {!isHost && event.host && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">Host Details</h3>
            <p className="text-gray-700">👤 {event.host.name}</p>
            <p className="text-gray-700">📧 {event.host.email}</p>
          </div>
        )}

        {isHost && (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-700">
              <FiUsers className="text-purple-500 text-xl" />
              <p className="text-lg font-medium">
                {event.registrationCount || 0} {" "}
                {event.registrationCount === 1 ? "Registration" : "Registrations"}
              </p>
            </div>
          </div>
      )}

        <div className="mt-8 flex justify-between">
          {!isHost && (
            isRegistered ? (
              <button className="bg-gray-400 text-white px-5 py-2 rounded-lg shadow-md transition cursor-not-allowed">
                Already Registered
              </button>
            ) : (
              <button
                className="bg-purple-600 text-white hover:bg-purple-800 px-5 py-2 rounded-lg shadow-md transition"
                onClick={() => navigate(`/event/${id}/register`, { state: { eventId: id } })}
              >
                Register
              </button>
            )
          )}

          <button
            className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-700 shadow-md transition"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
