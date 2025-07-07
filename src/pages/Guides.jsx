// Guides.jsx
import React, { useContext } from 'react';
import { UserContext } from '../context/userAuthContext';
import guides from '../data/guides.json';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom'; // Import Link

export default function Guides() {
  const { bookmarks, toggleBookmark, user } = useContext(UserContext);

  const handleBookmarkClick = (guideId) => {
    if (!user) {
      alert("Please log in to bookmark guides.");
      return;
    }
    toggleBookmark(guideId);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Guides</h1>

      <div className="grid gap-6">
        {guides.map((guide) => {
          const isBookmarked = bookmarks.includes(guide.id);
          return (
            <div key={guide.id} className="border p-4 rounded shadow-sm relative">
              <Link to={`/guides/${guide.id}`} className="block"> {/* Wrap content in Link */}
                <h2 className="text-xl font-semibold mb-2 hover:underline">{guide.title}</h2>
                <p className="text-gray-600 text-sm mb-2">{guide.category}</p>
                <p className="text-sm text-gray-700">{guide.description}</p>
              </Link>
              <button
                onClick={() => handleBookmarkClick(guide.id)}
                className="absolute top-4 right-4"
                aria-label="Bookmark guide"
              >
                {isBookmarked && user ? (
                  <BookmarkSolid className="w-6 h-6 text-yellow-500" />
                ) : (
                  <BookmarkOutline className="w-6 h-6 text-gray-400 hover:text-yellow-500" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}