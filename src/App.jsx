import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Blogs from "./pages/Blogs.jsx";
import BlogNew from "./pages/BlogNew.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import Confessions from "./pages/Confessions.jsx";
import ConfessionNew from "./pages/ConfessionNew.jsx";
import ConfessionDetail from "./pages/ConfessionDetail.jsx";
import PreviousChats from "./pages/PreviousChats.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import RandomChat from "./pages/RandomChat.jsx";
import Profile from "./pages/Profile.jsx";
import ProfilePosts from "./pages/ProfilePosts.jsx";
import ProfileConfessions from "./pages/ProfileConfessions.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import SocietyUpdates from "./pages/SocietyUpdates.jsx";
import SocietyUpdateNew from "./pages/SocietyUpdateNew.jsx";
import SocietyUpdateDetail from "./pages/SocietyUpdateDetail.jsx";
import FriendRequests from "./pages/FriendRequests.jsx";
import Friends from "./pages/Friends.jsx";

function ProtectedRoute({ children }) {
  const { loggedIn, initializing } = useAuth();
  if (initializing) return null;
  if (!loggedIn) return <Navigate to="/auth/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="auth/login" element={<Login />} />
          <Route path="auth/signup" element={<Signup />} />
          <Route path="auth/forgot" element={<ForgotPassword />} />
          <Route path="blogs" element={<Blogs />} />
          <Route
            path="blogs/new"
            element={
              <ProtectedRoute>
                <BlogNew />
              </ProtectedRoute>
            }
          />
          <Route path="blogs/:id" element={<BlogDetail />} />

          <Route path="confessions" element={<Confessions />} />
          <Route
            path="confessions/new"
            element={
              <ProtectedRoute>
                <ConfessionNew />
              </ProtectedRoute>
            }
          />
          <Route path="confessions/:id" element={<ConfessionDetail />} />
          <Route path="society-updates" element={<SocietyUpdates />} />
          <Route path="society-updates/:id" element={<SocietyUpdateDetail />} />
          <Route
            path="society-updates/new"
            element={
              <ProtectedRoute>
                <SocietyUpdateNew />
              </ProtectedRoute>
            }
          />
          <Route
            path="updates"
            element={
              <ProtectedRoute>
                <FriendRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="previous-chats"
            element={
              <ProtectedRoute>
                <PreviousChats />
              </ProtectedRoute>
            }
          />
          <Route
            path="friends"
            element={
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            }
          />
          <Route
            path="chat/:chatId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="random-chat"
            element={
              <ProtectedRoute>
                <RandomChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile/posts"
            element={
              <ProtectedRoute>
                <ProfilePosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile/confessions"
            element={
              <ProtectedRoute>
                <ProfileConfessions />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
