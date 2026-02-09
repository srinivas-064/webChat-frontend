import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ChevronDown, LogOut, Settings, User, Users, FileText, Sparkles, History, Shuffle, Megaphone, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchFriendRequests, searchUsers, sendFriendRequest } from "../api/friend.api";
import { getPreviousChats } from "../api/chat.api";
import { useToast } from "../context/ToastContext.jsx";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-full text-sm font-semibold transition ${
    isActive ? "text-cyan-700 bg-cyan-50" : "text-gray-700 hover:bg-gray-100"
  }`;

export default function Navbar() {
  const { loggedIn, user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() && loggedIn) {
        searchUsers(search)
          .then(setResults)
          .catch(() => setResults([]));
      } else {
        setResults([]);
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!loggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRequestCount(0);
      return;
    }
    let prev = null;
    const poll = async () => {
      try {
        const reqs = await fetchFriendRequests();
        const pending = (reqs || []).filter((r) => r.status === "pending");
        setRequestCount(pending.length);
        if (prev !== null && pending.length > prev) {
          addToast({
            title: "New friend request",
            description: `${pending.length - prev} new request${pending.length - prev > 1 ? "s" : ""}`,
          });
        }
        prev = pending.length;
      } catch {
        setRequestCount(0);
      }
    };
    poll();
    const id = setInterval(poll, 20000);
    return () => clearInterval(id);
  }, [loggedIn, addToast]);

  useEffect(() => {
    if (!loggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChatUnreadCount(0);
      return;
    }
    let alive = true;
    const poll = async () => {
      try {
        const chats = await getPreviousChats();
        const unread = (chats || []).filter((c) => c.unread).length;
        if (alive) setChatUnreadCount(unread);
      } catch {
        if (alive) setChatUnreadCount(0);
      }
    };
    poll();
    const id = setInterval(poll, 20000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [loggedIn]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-10 h-16">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-gray-900 text-lg">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white flex items-center justify-center">
            C
          </div>
          Chat Web
        </Link>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-5 py-2 flex-1 max-w-2xl ml-16 relative"
        >
          <Search size={18} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find friends"
            className="bg-transparent w-full outline-none text-sm"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
          />
          {searchOpen && results.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-lg z-30 p-2 space-y-1 max-h-64 overflow-y-auto">
              {results.map((r) => {
                const userId = r.id || r._id;
                const name = r.name || r.username || r.email || "User";
                const avatar =
                  r.avatar ||
                  r.profilePic ||
                  "https://api.dicebear.com/9.x/bottts/svg?seed=ChatWeb";
                return (
                <div
                  key={userId}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover" />
                    <div className="text-sm font-semibold text-gray-800">{name}</div>
                  </div>
                  <button
                    className="text-xs font-semibold text-cyan-700 hover:text-cyan-800"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={async () => {
                      try {
                        await sendFriendRequest(userId);
                        addToast({ title: "Request sent", description: `Sent to ${name}` });
                      } catch (err) {
                        addToast({ title: "Error", description: err.message || "Failed to send" });
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              );
              })}
            </div>
          )}
        </form>

        <div className="hidden md:flex items-center gap-3 ml-auto pr-2">
          <NavLink to="/blogs" className={navLinkClass}>
            <FileText size={16} /> Blogs
          </NavLink>
          <NavLink to="/confessions" className={navLinkClass}>
            <Sparkles size={16} /> Confessions
          </NavLink>
          <NavLink
            to="/society-updates"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-sm font-semibold transition ${
                isActive ? "text-cyan-700 bg-cyan-50 shadow-sm" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Megaphone size={16} /> Society Updates
          </NavLink>
          <NavLink to="/previous-chats" className={navLinkClass}>
            <History size={16} /> Chats
            {chatUnreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full text-[11px] font-semibold bg-rose-500 text-white">
                {chatUnreadCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/random-chat" className={navLinkClass}>
            <Shuffle size={16} /> Random Chat
          </NavLink>

          {loggedIn ? (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50"
              >
                <img
                  src={user?.avatar || "https://api.dicebear.com/9.x/bottts/svg?seed=ChatWeb"}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    <User size={16} /> Profile
                  </Link>
                  <Link
                    to="/friends"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    <Users size={16} /> Friends
                  </Link>
                  <Link
                    to="/updates"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    🔔 Updates
                    {requestCount > 0 && (
                      <span className="ml-auto text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                        {requestCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth/login" className="px-3 py-2 rounded-full text-sm font-semibold text-cyan-700 hover:bg-cyan-50">
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="px-3 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-teal-500 shadow hover:from-cyan-600 hover:to-teal-600"
              >
                Signup
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4">
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find friends"
                className="bg-transparent w-full outline-none text-sm"
              />
            </div>
            {results.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 space-y-1 max-h-60 overflow-y-auto">
                {results.map((r) => {
                  const userId = r.id || r._id;
                  const name = r.name || r.username || r.email || "User";
                  const avatar =
                    r.avatar ||
                    r.profilePic ||
                    "https://api.dicebear.com/9.x/bottts/svg?seed=ChatWeb";
                  return (
                  <div
                    key={userId}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="text-sm font-semibold text-gray-800">{name}</div>
                    </div>
                    <button
                      className="text-xs font-semibold text-cyan-700 hover:text-cyan-800"
                      onClick={async () => {
                        try {
                          await sendFriendRequest(userId);
                          addToast({ title: "Request sent", description: `Sent to ${name}` });
                        } catch (err) {
                          addToast({ title: "Error", description: err.message || "Failed to send" });
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  );
                })}
              </div>
            )}
          </form>

          <div className="space-y-2">
            <NavLink to="/blogs" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <FileText size={16} /> Blogs
            </NavLink>
            <NavLink to="/confessions" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <Sparkles size={16} /> Confessions
            </NavLink>
            <NavLink to="/society-updates" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <Megaphone size={16} /> Society Updates
            </NavLink>
            <NavLink to="/previous-chats" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <History size={16} /> Chats
              {chatUnreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full text-[11px] font-semibold bg-rose-500 text-white">
                  {chatUnreadCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/random-chat" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <Shuffle size={16} /> Random Chat
            </NavLink>
          </div>

          {loggedIn ? (
            <div className="border border-gray-200 rounded-xl p-2 space-y-1">
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                <User size={16} /> Profile
              </Link>
              <Link to="/friends" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                <Users size={16} /> Friends
              </Link>
              <Link to="/updates" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                🔔 Updates
                {requestCount > 0 && (
                  <span className="ml-auto text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                    {requestCount}
                  </span>
                )}
              </Link>
              <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                <Settings size={16} /> Settings
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth/login" className="px-3 py-2 rounded-full text-sm font-semibold text-cyan-700 hover:bg-cyan-50" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="px-3 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-teal-500 shadow hover:from-cyan-600 hover:to-teal-600"
                onClick={() => setMobileOpen(false)}
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
