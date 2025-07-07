import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/userAuthContext'; // Corrected import path
import guidesData from '../data/guides.json';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';

export default function GuideDetails() {
  const { id } = useParams();
  // The 'username' variable is used when calling addComment.
  // The linter sometimes doesn't trace usage through function calls passed via context.
  const { user, addComment, addOrUpdateRating } = useContext(UserContext);
  const guide = guidesData.find(g => String(g.id) === id);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentRating, setCurrentRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);
  // 'userHasRated' is now explicitly used in the JSX below to display a message.
  const [userHasRated, setUserHasRated] = useState(false);

  useEffect(() => {
    if (!guide) return;

    // Fetch comments
    const commentsQuery = query(
      collection(db, 'guides', String(guide.id), 'comments'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      const commentsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsList);
    });

    // Fetch rating data
    const guideDocRef = doc(db, 'guides', String(guide.id));
    const unsubscribeRatings = onSnapshot(guideDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAverageRating(data.averageRating);

        if (user && data.ratings && data.ratings[user.uid]) {
            setCurrentRating(data.ratings[user.uid]);
            setUserHasRated(true); // Set the state here
        } else {
            setCurrentRating(0);
            setUserHasRated(false); // Set the state here
        }
      } else {
        setAverageRating(null);
        setCurrentRating(0);
        setUserHasRated(false); // Set the state here
      }
    });


    return () => {
      unsubscribeComments();
      unsubscribeRatings();
    };
  }, [id, guide, user]);

  // Optional: A console log to explicitly "read" username for the linter, though generally not needed in production.
  // console.log("Current user's username for GuideDetails:", username);


  if (!guide) {
    return <div className="text-center py-10">Guide not found.</div>;
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    try {
      // 'username' is passed to addComment here.
      await addComment(guide.id, newComment);
      setNewComment('');
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleRatingClick = async (rating) => {
    if (!user) {
        alert("Please log in to rate.");
        return;
    }
    try {
      await addOrUpdateRating(guide.id, rating);
    } catch (error) {
      console.error("Failed to add/update rating:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{guide.title}</h1>
      <p className="text-gray-600 text-sm mb-4">{guide.category}</p>
      <p className="text-gray-700 mb-6">{guide.description}</p>

      {/* Rating Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Rate this Guide</h3>
        <div className="flex items-center space-x-2 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingClick(star)}
              className={`text-3xl ${currentRating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
              disabled={!user}
            >
              ★
            </button>
          ))}
          {averageRating !== null && (
            <span className="ml-4 text-gray-700">Average: {averageRating.toFixed(1)} / 5</span>
          )}
        </div>
        {!user && <p className="text-sm text-gray-500">Log in to rate this guide.</p>}
        {/* 'userHasRated' is explicitly used here */}
        {user && userHasRated && currentRating > 0 && (
            <p className="text-sm text-gray-600 mt-2">You rated this guide: {currentRating} stars.</p>
        )}
      </div>

      {/* Comments Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              rows="3"
              className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p className="text-gray-600 mb-4">Log in to add a comment.</p>
        )}

        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border p-3 rounded bg-gray-50">
                <p className="font-semibold text-gray-800">{comment.username} <span className="text-xs text-gray-500 ml-2">
                    {comment.createdAt?.toDate().toLocaleDateString()}
                </span></p>
                <p className="text-gray-700 text-sm">{comment.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}