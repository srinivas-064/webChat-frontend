import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getChat, sendMessage } from "../api/chat.api";
import { MessageBubble } from "../components/chat/MessageBubble";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ShieldX, Sparkles } from "lucide-react";
import { socket } from "../lib/socket";
import { useAuth } from "../context/AuthContext";
import { nanoid } from "../utils/id";

const storageKey = (id) => `randomChat:${id}`;

const loadStoredChat = (id) => {
  try {
    const raw = sessionStorage.getItem(storageKey(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredChat = (id, data) => {
  try {
    sessionStorage.setItem(storageKey(id), JSON.stringify(data));
  } catch {
    return;
  }
};

const clearStoredChat = (id) => {
  try {
    sessionStorage.removeItem(storageKey(id));
  } catch {
    return;
  }
};

export default function ChatPage() {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRandom = location.state?.isRandom || chatId?.startsWith("random:");
  const randomPersona = location.state?.persona || "Anonymous";
  const randomAvatar =
    location.state?.avatar ||
    `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(randomPersona)}`;

  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [ended, setEnded] = useState(false);
  const [endedMessage, setEndedMessage] = useState("");
  const messagesRef = useRef(null);
  const pendingIdsRef = useRef(new Set());
  const endedRef = useRef(false);
  const isUnloadingRef = useRef(false);
  const cleanupCountRef = useRef(0);

  const markEnded = (message) => {
    endedRef.current = true;
    setEnded(true);
    setEndedMessage(message);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      isUnloadingRef.current = true;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (isRandom) {
      const stored = loadStoredChat(chatId);
      const persona = stored?.persona || randomPersona;
      const avatar = stored?.avatar || randomAvatar;
      const messages = stored?.messages || [];

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChat({
        id: chatId,
        persona,
        avatar,
        messages,
      });
      if (!socket.connected) socket.connect();
      socket.emit("resumeRandomChat", { roomId: chatId });
      return;
    }

    getChat(chatId).then(setChat);
  }, [chatId, isRandom, randomAvatar, randomPersona]);

  useEffect(() => {
    if (!isRandom || !chat) return;
    saveStoredChat(chatId, {
      persona: chat.persona,
      avatar: chat.avatar,
      messages: chat.messages || [],
    });
  }, [isRandom, chatId, chat]);

  useEffect(() => {
    if (!isRandom) return;

    const handleResumed = (payload) => {
      if (!payload?.roomId || payload.roomId !== chatId) return;
      const normalizedMessages = (payload.messages || []).map((m) => ({
        id: m?.id || nanoid(),
        from: m?.senderId && user?.id && m.senderId === user.id ? "me" : "them",
        text: m?.text || "",
        createdAt: m?.createdAt || Date.now(),
      }));
      setChat((c) => {
        const messages = normalizedMessages.length ? normalizedMessages : c?.messages || [];
        return {
          id: chatId,
          persona: payload.persona || c?.persona || randomPersona,
          avatar: payload.avatar || c?.avatar || randomAvatar,
          messages,
        };
      });
    };

    const handleReceive = (msg) => {
      if (msg?.clientId && pendingIdsRef.current.has(msg.clientId)) {
        pendingIdsRef.current.delete(msg.clientId);
        return;
      }

      const from = msg?.senderId && user?.id && msg.senderId === user.id ? "me" : "them";
      const normalized = {
        id: msg?.id || nanoid(),
        from,
        text: msg?.text || "",
        createdAt: msg?.createdAt || Date.now(),
      };

      setChat((c) => {
        const base = c || {
          id: chatId,
          persona: randomPersona,
          avatar: randomAvatar,
          messages: [],
        };
        return { ...base, messages: [...(base.messages || []), normalized] };
      });
    };

    const handlePartnerLeft = (payload) => {
      const reason = payload?.reason;
      if (reason === "ended") {
        markEnded("Your partner ended the chat.");
      } else {
        markEnded("Your partner left the chat.");
      }
    };

    socket.off("resumed", handleResumed);
    socket.off("receiveMessage", handleReceive);
    socket.off("partnerLeft", handlePartnerLeft);
    socket.on("resumed", handleResumed);
    socket.on("receiveMessage", handleReceive);
    socket.on("partnerLeft", handlePartnerLeft);

    return () => {
      socket.off("resumed", handleResumed);
      socket.off("receiveMessage", handleReceive);
      socket.off("partnerLeft", handlePartnerLeft);
    };
  }, [chatId, isRandom, randomAvatar, randomPersona, user?.id]);

  useEffect(() => {
    if (!isRandom) return;

    return () => {
      if (import.meta.env.DEV && cleanupCountRef.current === 0) {
        cleanupCountRef.current += 1;
        return;
      }
      cleanupCountRef.current += 1;
      if (!isUnloadingRef.current && !endedRef.current) {
        socket.emit("endChat");
        clearStoredChat(chatId);
      }
    };
  }, [isRandom, chatId]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chat?.messages]);

  const handleEndChat = () => {
    if (!isRandom || ended) return;
    markEnded("You ended the chat.");
    clearStoredChat(chatId);
    socket.emit("endChat");
    navigate("/");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || blocked || ended) return;

    if (isRandom) {
      const clientId = nanoid();
      const newMsg = { id: clientId, from: "me", text: text.trim(), createdAt: Date.now() };
      pendingIdsRef.current.add(clientId);
      setChat((c) => ({
        ...c,
        messages: [...(c?.messages || []), newMsg],
      }));
      socket.emit("sendMessage", { text: text.trim(), clientId });
      setText("");
      return;
    }

    const msg = await sendMessage(chatId, text.trim());
    setChat((c) => ({ ...c, messages: [...(c?.messages || []), msg] }));
    setText("");
  };

  if (!chat) return <div className="text-gray-600">Loading chat...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex items-center gap-3">
        <img src={chat.avatar} alt={chat.persona} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="font-bold text-gray-900">{chat.persona}</div>
          <p className="text-sm text-gray-600">Stay respectful. Anonymous personas only.</p>
        </div>
        <div className="flex items-center gap-2">
          {isRandom ? (
            ended ? (
              <Button variant="soft" onClick={() => navigate("/")}>
                Home
              </Button>
            ) : (
              <Button variant="danger" onClick={handleEndChat}>
                End Chat
              </Button>
            )
          ) : null}
          <Button variant={blocked ? "danger" : "ghost"} onClick={() => setBlocked((v) => !v)}>
            <ShieldX size={16} /> {blocked ? "Blocked" : "Block"}
          </Button>
        </div>
      </div>

      <div
        ref={messagesRef}
        className="bg-white border border-gray-100 rounded-2xl shadow-inner p-4 h-[420px] overflow-y-auto flex flex-col gap-3"
      >
        {(chat.messages || []).map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 space-y-3">
        {endedMessage ? (
          <div className="text-sm text-red-600">{endedMessage}</div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {["What course are you from?", "Favorite food spot?", "Weekend plan?", "Got a playlist?"].map((ice) => (
            <button
              key={ice}
              onClick={() => setText(ice)}
              className="px-3 py-2 rounded-full bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
            >
              <Sparkles size={14} /> {ice}
            </button>
          ))}
        </div>
        <form className="flex gap-3" onSubmit={handleSend}>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            className="flex-1"
            disabled={blocked || ended}
          />
          <Button type="submit" disabled={blocked || ended}>Send</Button>
        </form>
      </div>
    </div>
  );
}
