import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="text-center space-y-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
      <h1 className="text-4xl font-black text-gray-900">404</h1>
      <p className="text-gray-600">Page not found.</p>
      <Button as={Link} to="/">
        Go Home
      </Button>
    </div>
  );
}
