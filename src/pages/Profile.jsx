import { useContext } from 'react';
import { UserContext } from '../context/userAuthContext';
import guides from '../data/guides.json';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, username, logout, bookmarks, loading } = useContext(UserContext);
  const navigate = useNavigate();

  // Redirect to Auth page if not logged in and done loading
  if (!user && !loading) {
    navigate('/auth');
    return null; // Don't render anything until redirected
  }

  const savedGuides = guides.filter(guide => bookmarks.includes(guide.id));

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {user ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Welcome, {username || user.email}!</h2>
          <button
            onClick={logout}
            className="mb-6 text-sm underline text-red-500 hover:text-red-700"
          >
            Log out
          </button>

          <h3 className="text-xl font-semibold mb-2">Your Bookmarked Guides:</h3>
          {savedGuides.length > 0 ? (
            <ul className="space-y-2">
              {savedGuides.map((guide) => (
                <li key={guide.id} className="border p-4 rounded shadow-sm">
                  <h4 className="text-lg font-medium">{guide.title}</h4>
                  <p className="text-sm text-gray-600">{guide.category}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">You haven't bookmarked any guides yet.</p>
          )}
          {/* Add sections for comments and ratings here */}
        </div>
      ) : (
        // This block might not be reached if redirected by `Maps('/auth')`
        // but kept for clarity in case of direct access before redirect.
        <div className="text-center">
          <p className="text-lg mb-4">Please log in to view your profile.</p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Login / Sign Up
          </button>
        </div>
      )}
    </div>
  );
}