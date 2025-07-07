import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-semibold text-blue-600 hover:text-blue-800 transition">
          🧳 LandingHome
        </Link>
        <div className="space-x-6">
          <Link to="/" className="text-gray-800 hover:text-blue-600">Home</Link>
          <Link to="/resources" className="text-gray-800 hover:text-blue-600">Resources</Link>
          <Link to="/guides" className="text-gray-800 hover:text-blue-600">Guides</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
