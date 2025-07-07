import React, { useState } from 'react';
import { guides } from '../data/guides';

function Guides() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [bookmarkedGuides, setBookmarkedGuides] = useState(
    JSON.parse(localStorage.getItem('bookmarkedGuides')) || []
  );
  const [visibleGuides, setVisibleGuides] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [...new Set(guides.map((guide) => guide.tags.join(', ')))]; // Category based on tags

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  const handleBookmark = (guide) => {
    const newBookmarkedGuides = [...bookmarkedGuides];
    const isBookmarked = newBookmarkedGuides.some((item) => item.id === guide.id);

    if (isBookmarked) {
      // Remove bookmark
      const updatedBookmarks = newBookmarkedGuides.filter((item) => item.id !== guide.id);
      setBookmarkedGuides(updatedBookmarks);
      localStorage.setItem('bookmarkedGuides', JSON.stringify(updatedBookmarks));
    } else {
      // Add bookmark
      newBookmarkedGuides.push(guide);
      setBookmarkedGuides(newBookmarkedGuides);
      localStorage.setItem('bookmarkedGuides', JSON.stringify(newBookmarkedGuides));
    }
  };

  // Logging guides to check if they are loaded correctly
  console.log(guides);

  const filteredGuides = guides.filter(
    (guide) =>
      (categoryFilter ? guide.tags.join(', ').toLowerCase().includes(categoryFilter.toLowerCase()) : true) &&
      (search
        ? guide.title.toLowerCase().includes(search.toLowerCase()) ||
          guide.description.toLowerCase().includes(search.toLowerCase())
        : true)
  );

  // Log the filtered guides to check if the filtering works
  console.log(filteredGuides);

  const loadMoreGuides = () => {
    if (isLoading || visibleGuides >= filteredGuides.length) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleGuides(visibleGuides + 6);
      setIsLoading(false);
    }, 1000); // Simulating loading delay
  };

  const displayedGuides = filteredGuides.slice(0, visibleGuides);

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-8">
      {/* Sidebar Filters */}
      <div className="w-64 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-700">Filters</h3>

        <div className="mt-4">
          <h4 className="font-medium">Category</h4>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryFilter(category)}
                className="block w-full text-left text-gray-600 hover:text-blue-600"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guides Display */}
      <div className="flex-1">
        <h2 className="text-3xl font-semibold text-blue-700 mb-8">Browse Guides</h2>

        <input
          type="text"
          placeholder="Search guides..."
          value={search}
          onChange={handleSearch}
          className="p-4 border rounded-lg w-full mb-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-200 ease-in-out p-6"
            >
              <h3 className="text-xl font-semibold text-blue-700">{guide.title}</h3>
              <p className="text-gray-600 mt-2">{guide.description}</p>
              <div className="mt-4">
                <div className="space-x-2">
                  {guide.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bookmark Button */}
              <button
                onClick={() => handleBookmark(guide)}
                className={`mt-4 px-4 py-2 rounded-lg text-white ${
                  bookmarkedGuides.some((item) => item.id === guide.id)
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
              >
                {bookmarkedGuides.some((item) => item.id === guide.id) ? 'Remove Bookmark' : 'Bookmark'}
              </button>
            </div>
          ))}
        </div>

        {/* Infinite Scroll Trigger */}
        {isLoading ? (
          <div className="text-center mt-4">Loading more guides...</div>
        ) : (
          <button
            onClick={loadMoreGuides}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default Guides;
