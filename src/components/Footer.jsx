import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid gap-8 md:grid-cols-3 text-sm text-gray-700">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Explore</h4>
          <ul className="space-y-2">
            <li><a className="hover:text-cyan-600" href="/">Home</a></li>
            <li><a className="hover:text-cyan-600" href="/about">About</a></li>
            <li><a className="hover:text-cyan-600" href="/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Account</h4>
          <ul className="space-y-2">
            <li><a className="hover:text-cyan-600" href="/auth/login">Sign in</a></li>
            <li><a className="hover:text-cyan-600" href="/auth/signup">Create account</a></li>
            <li><a className="hover:text-cyan-600" href="/previous-chats">Friends</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Stay in touch</h4>
          <ul className="space-y-2">
            <li><a className="hover:text-cyan-600" href="mailto:chatwebkgp@gmail.com">chatwebkgp@gmail.com</a></li>
            <li className="flex gap-3 text-cyan-600">
              <span>🐦</span>
              <span>📸</span>
              <span>💼</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
