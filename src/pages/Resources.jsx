import React, { useState } from 'react';
import { embeddedResources } from '../data/resourcesWithEmbeddings';

function Resources() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [page, setPage] = useState(1);
  const resultsPerPage = 6;

  const categories = [...new Set(embeddedResources.map((res) => res.category))];
  const locations = [...new Set(embeddedResources.map((res) => res.location))];

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearch(val);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  const handleLocationFilter = (location) => {
    setLocationFilter(location);
  };

  const filteredResults = embeddedResources.filter(
    (resource) =>
      (categoryFilter ? resource.category === categoryFilter : true) &&
      (locationFilter ? resource.location === locationFilter : true) &&
      (search
        ? resource.title.toLowerCase().includes(search.toLowerCase()) ||
          resource.description.toLowerCase().includes(search.toLowerCase())
        : true)
  );

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const displayedResults = filteredResults.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-8">
      {/* Sidebar Filters */}
      <div className="w-64 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-700">Filters</h3>

        <div className="mt-4">
          <h4 className="font-medium">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className="block w-full text-left text-gray-600 hover:text-blue-600"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium">Location</h4>
          <div className="space-y-2">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => handleLocationFilter(location)}
                className="block w-full text-left text-gray-600 hover:text-blue-600"
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Display */}
      <div className="flex-1">
        <h2 className="text-3xl font-semibold text-blue-700 mb-8">Browse Resources</h2>

        <input
          type="text"
          placeholder="Search for help (e.g. housing, health, refugee)..."
          value={search}
          onChange={handleSearch}
          className="p-4 border rounded-lg w-full mb-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedResults.map((resource) => (
            <div
              key={resource.id}
              className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-200 ease-in-out p-6"
            >
              <h3 className="text-xl font-semibold text-blue-700">{resource.title}</h3>
              <p className="text-gray-600 text-sm">{resource.location}</p>
              <p className="text-gray-800 mt-2">{resource.description}</p>
              <div className="mt-4">
                <span className="inline-block bg-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  {resource.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Previous
          </button>
          <span className="flex items-center text-lg font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Resources;
