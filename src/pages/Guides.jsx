// Guides.jsx
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import guides from '../data/guides.json'; // adjust path to where your guides data is stored
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';

export default function Guides() {
  const { bookmarks, toggleBookmark } = useContext(UserContext);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Guides</h1>

      <div className="grid gap-6">
        {guides.map((guide) => {
          const isBookmarked = bookmarks.includes(guide.id);
          return (
            <div key={guide.id} className="border p-4 rounded shadow-sm relative">
              <h2 className="text-xl font-semibold mb-2">{guide.title}</h2>
              <p className="text-gray-600 text-sm mb-2">{guide.category}</p>
              <p className="text-sm text-gray-700">{guide.description}</p>

              <button
                onClick={() => toggleBookmark(guide.id)}
                className="absolute top-4 right-4"
                aria-label="Bookmark guide"
              >
                {isBookmarked ? (
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