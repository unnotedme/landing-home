import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import guides from '../data/guides.json'; // or however you store guides

export default function Profile() {
  const { username, login, logout, bookmarks } = useContext(UserContext);
  const [input, setInput] = useState('');

  const savedGuides = guides.filter(guide => bookmarks.includes(guide.id));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {!username ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">Create your profile</h2>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your name"
            className="border rounded p-2 mb-4 w-full"
          />
          <button
            onClick={() => login(input)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Save Profile
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Welcome, {username}!</h2>
          <button onClick={logout} className="mb-6 text-sm underline text-red-500">Log out</button>

          <h3 className="text-xl font-semibold mb-2">Your Bookmarked Guides:</h3>
          {savedGuides.length > 0 ? (
            <ul className="space-y-2">
              {savedGuides.map((guide) => (
                <li key={guide.id} className="border p-4 rounded">
                  <h4 className="text-lg font-medium">{guide.title}</h4>
                  <p className="text-sm text-gray-600">{guide.category}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't bookmarked any guides yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
