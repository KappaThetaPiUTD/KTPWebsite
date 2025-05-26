// components/RSVPButton.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function RSVPButton({ eventId, eventTitle, userId }) {
  const [status, setStatus] = useState(null);

  const handleRSVP = async () => {
    const { error } = await supabase.from("rsvps").insert([
      {
        event_id: eventId,
        event_title: eventTitle,
        user_id: userId,
        response: "going",
      },
    ]);

    if (error) {
      setStatus("error");
      console.error("RSVP failed:", error.message);
    } else {
      setStatus("success");
    }
  };

  return (
    <div>
      <button
        onClick={handleRSVP}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        RSVP Going
      </button>
      {status === "success" && <p className="text-green-500">RSVP sent!</p>}
      {status === "error" && <p className="text-red-500">RSVP failed</p>}
    </div>
  );
}
