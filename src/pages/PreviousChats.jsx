import React, { useEffect, useState } from "react";
import { getPreviousChats, getRandomChats } from "../api/chat.api";
import { ChatListItem } from "../components/chat/ChatListItem";
import { Skeleton } from "../components/ui/Skeleton";

export default function PreviousChats() {
  const [friendChats, setFriendChats] = useState([]);
  const [randomChats, setRandomChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPreviousChats(), getRandomChats()]).then(([friends, randoms]) => {
      setFriendChats(friends || []);
      setRandomChats(randoms || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-cyan-700 uppercase">Chats</p>
        <h1 className="text-3xl font-bold text-gray-900">Your conversations</h1>
      </div>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Friends</h2>
            {friendChats.length ? (
              friendChats.map((c) => <ChatListItem key={c.id} chat={c} />)
            ) : (
              <div className="bg-white border border-dashed rounded-2xl p-6 text-center text-gray-600">
                No friend chats yet.
              </div>
            )}
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Random</h2>
            {randomChats.length ? (
              randomChats.map((c) => <ChatListItem key={c.id} chat={c} />)
            ) : (
              <div className="bg-white border border-dashed rounded-2xl p-6 text-center text-gray-600">
                No random chats yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
