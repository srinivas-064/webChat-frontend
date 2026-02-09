import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFriends } from "../api/friend.api";
import { startFriendChat } from "../api/chat.api";
import { Button } from "../components/ui/Button";
import { useToast } from "../context/ToastContext";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchFriends()
      .then((data) => setFriends(data || []))
      .catch((err) => {
        addToast({ title: "Error", description: err?.message || "Failed to load friends" });
        setFriends([]);
      })
      .finally(() => setLoading(false));
  }, [addToast]);

  const handleChat = async (friend) => {
    const friendId = friend?._id || friend?.id;
    if (!friendId) return;
    try {
      setWorkingId(friendId);
      const res = await startFriendChat(friendId);
      navigate(`/chat/${res.chatId}`);
    } catch (err) {
      addToast({ title: "Error", description: err?.message || "Unable to start chat" });
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-cyan-700 uppercase">Friends</p>
        <h1 className="text-3xl font-bold text-gray-900">Your friends</h1>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-600">Loading friends...</div>
      ) : friends.length ? (
        <div className="grid gap-4">
          {friends.map((f) => {
            const id = f._id || f.id;
            const name = f.username || f.name || f.email || "Friend";
            const avatar =
              f.profilePic ||
              f.avatar ||
              "https://api.dicebear.com/9.x/bottts/svg?seed=ChatWeb";
            return (
              <div key={id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4">
                <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{name}</div>
                  <div className="text-sm text-gray-500">{f.email}</div>
                </div>
                <Button
                  variant="soft"
                  onClick={() => handleChat(f)}
                  disabled={workingId === id}
                >
                  Chat
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-dashed rounded-2xl p-6 text-center text-gray-600">
          No friends yet.
        </div>
      )}
    </div>
  );
}
