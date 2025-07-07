import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/userAuthContext';

function Navbar() {
  const { user } = useContext(UserContext); // Get user from context

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
          {user ? (
            <Link to="/profile" className="text-gray-800 hover:text-blue-600">Profile</Link>
          ) : (
            <Link to="/auth" className="text-gray-800 hover:text-blue-600">Login / Sign Up</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;