import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to Landing Home 🧳</h1>
      <p className="mb-6 text-gray-700">
        Helping immigrants, refugees, and LGBTQ+ newcomers find trusted, local support across Atlantic Canada.
      </p>

      <div className="space-y-4">
        <Link
          to="/resources"
          className="block w-full text-center bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          🌍 Browse Local Resources
        </Link>

        <Link
          to="/guides"
          className="block w-full text-center border border-blue-600 text-blue-600 py-3 rounded hover:bg-blue-50 transition"
        >
          📘 Read Newcomer Guides
        </Link>
      </div>
    </div>
  );
}

export default Home;
