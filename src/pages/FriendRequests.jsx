import React, { useEffect, useState } from "react";
import { fetchFriendRequests, respondToFriendRequest } from "../api/friend.api";
import { Button } from "../components/ui/Button";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriendRequests()
      .then(setRequests)
      .finally(() => setLoading(false));
  }, []);

  const update = async (id, action) => {
    await respondToFriendRequest(id, action);
    fetchFriendRequests().then(setRequests);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Friend requests</h1>
      {loading ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-600">
          Loading requests...
        </div>
      ) : requests.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-gray-600">No requests yet.</div>
      )}
      {!loading && requests.map((r) => {
        const requestId = r.id || r._id;
        const from =
          r.fromUser ||
          r.sender ||
          r.user ||
          r.from ||
          {};
        const name =
          from.name ||
          from.username ||
          from.email ||
          r.fromName ||
          r.targetName ||
          "User";
        return (
        <div
          key={requestId}
          className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-600 capitalize">Status: {r.status}</p>
          </div>
          {r.status === "pending" ? (
            <div className="flex gap-2">
              <Button variant="soft" onClick={() => update(requestId, "accept")}>Accept</Button>
              <Button variant="ghost" onClick={() => update(requestId, "reject")}>Decline</Button>
            </div>
          ) : (
            <span className="text-sm text-gray-600">{r.status}</span>
          )}
        </div>
        );
      })}
    </div>
  );
}
