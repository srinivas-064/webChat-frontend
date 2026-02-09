import React, { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { socket } from "../lib/socket";

export default function RandomChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isMatchingRef = useRef(false);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleMatched = ({ roomId, persona, avatar }) => {
      if (!isMatchingRef.current) return;
      isMatchingRef.current = false;
      setLoading(false);
      setError("");
      navigate(`/chat/${roomId}`, {
        state: { isRandom: true, persona, avatar },
      });
    };

    const handleConnectError = () => {
      isMatchingRef.current = false;
      setLoading(false);
      setError("Unable to connect. Please login again and retry.");
    };

    socket.off("matched", handleMatched);
    socket.off("connect_error", handleConnectError);

    socket.on("matched", handleMatched);
    socket.on("connect_error", handleConnectError);

    return () => {
      if (isMatchingRef.current) socket.emit("cancelRandomChat");
      socket.off("matched", handleMatched);
      socket.off("connect_error", handleConnectError);
    };
  }, [navigate]);

  const handleStart = () => {
    setLoading(true);
    setError("");
    isMatchingRef.current = true;
    socket.emit("randomChat");
  };

  const handleCancel = () => {
    isMatchingRef.current = false;
    setLoading(false);
    socket.emit("cancelRandomChat");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900">Random Chat</h1>
      <p className="text-gray-600">
        You’ll be paired with an anonymous campus persona. Be kind. Don’t share personal info. You can block anytime.
      </p>
      <ol className="list-decimal list-inside space-y-1 text-gray-700">
        <li>Chats are anonymous personas.</li>
        <li>Use icebreakers if you get stuck.</li>
        <li>Block ends the chat instantly.</li>
      </ol>
      <div className="flex items-center gap-3">
        <Button onClick={handleStart} disabled={loading} className="mt-2">
          {loading ? <><Loader2 className="animate-spin" size={16} /> Matching...</> : "Start Random Chat"}
        </Button>
        {loading ? (
          <Button variant="ghost" onClick={handleCancel} className="mt-2">
            Cancel
          </Button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
