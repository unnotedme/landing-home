// Resources.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const categoryOptions = [
  { value: 'Housing', label: 'Housing' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Employment', label: 'Employment' },
  { value: 'Health', label: 'Health' },
  // Add more categories as needed
];

const resourcesData = [
  // Sample data structure
  {
    id: 1,
    title: 'Affordable Housing Nova Scotia',
    category: 'Housing',
    location: 'Halifax, NS',
  },
  // Add more resource objects
];

export default function Resources() {
  const [filteredResources, setFilteredResources] = useState(resourcesData);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 6;

  useEffect(() => {
    let filtered = [...resourcesData];

    if (locationQuery) {
      filtered = filtered.filter(resource =>
        resource.location.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      const values = selectedCategories.map(c => c.value);
      filtered = filtered.filter(resource =>
        values.includes(resource.category)
      );
    }

    setFilteredResources(filtered);
    setCurrentPage(1); // reset to first page when filters change
  }, [locationQuery, selectedCategories]);

  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected || []);
  };

  const handleLocationChange = (e) => {
    setLocationQuery(e.target.value);
  };

  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);

  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Community Resources</h1>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:gap-6">
        <Select
          isMulti
          options={categoryOptions}
          value={selectedCategories}
          onChange={handleCategoryChange}
          placeholder="Filter by category..."
          className="w-full md:w-1/2"
        />

        <input
          type="text"
          placeholder="Search by city or province..."
          value={locationQuery}
          onChange={handleLocationChange}
          className="w-full md:w-1/2 border border-gray-300 rounded p-2"
        />
      </div>

      <div className="grid gap-6">
        {currentResources.length > 0 ? (
          currentResources.map((resource) => (
            <div key={resource.id} className="border p-4 rounded shadow-sm">
              <h2 className="text-xl font-semibold">{resource.title}</h2>
              <p className="text-sm text-gray-600">{resource.category} | {resource.location}</p>
            </div>
          ))
        ) : (
          <p>No resources found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded text-white ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          Previous
        </button>

        <span className="font-medium">Page {currentPage} of {totalPages}</span>

        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className={`px-4 py-2 rounded text-white ${currentPage >= totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}