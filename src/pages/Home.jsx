import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function Home() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
      <div className="space-y-4">
        <p className="text-sm font-semibold text-cyan-700 uppercase">Chat Web</p>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
          A safe corner for KGPians to blog, confess, and chat anonymously.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Share stories, drop confessions, or meet a random persona. Frontend-only mock app so you can explore without backend setup.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button as={Link} to="/blogs">
            Explore Blogs
          </Button>
          <Button variant="ghost" as={Link} to="/confessions">
            Browse Confessions
          </Button>
          <Button variant="soft" as={Link} to="/random-chat">
            Try Random Chat
          </Button>
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://api.dicebear.com/9.x/bottts/svg?seed=MintPanda"
                alt="Mint Panda"
                className="w-11 h-11 rounded-2xl bg-cyan-50"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Random Chat</div>
              <div className="text-xs text-gray-500">Matched with Mint Panda</div>
            </div>
          </div>
          <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2 py-1 rounded-full">
            Anonymous
          </span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
          <div className="flex">
            <div className="max-w-[70%] bg-white border border-gray-100 rounded-2xl px-3 py-2 text-sm text-gray-700 shadow-sm">
              Hey! You around the library today?
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[70%] bg-cyan-50 border border-cyan-100 rounded-2xl px-3 py-2 text-sm text-cyan-900 shadow-sm">
              Yup. Heading there after 6.
            </div>
          </div>
          <div className="flex">
            <div className="max-w-[70%] bg-white border border-gray-100 rounded-2xl px-3 py-2 text-sm text-gray-700 shadow-sm">
              Nice. Want to grab chai?
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <div className="text-sm text-gray-500 flex-1">Type a message…</div>
          <div className="text-xs font-semibold text-cyan-700">Send</div>
        </div>
      </div>
    </div>
  );
}
