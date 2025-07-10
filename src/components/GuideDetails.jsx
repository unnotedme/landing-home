// src/components/GuideDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; 
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function GuideDetail() {
  const { user } = useContext(UserContext);
  const { guideId } = useParams(); // Get guideId from URL parameter

  const [guide, setGuide] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState([]);

  // Fetch guide details from Firestore
  useEffect(() => {
    const fetchGuide = async () => {
      const docRef = doc(db, 'guides', guideId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setGuide(docSnap.data());
        setLikes(docSnap.data().likes || []);
        setComments(docSnap.data().comments || []);
      } else {
        console.log('No such guide!');
      }
    };

    fetchGuide();
  }, [guideId]);

  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') return;

    const commentData = {
      userId: user?.uid,
      comment: newComment,
      timestamp: new Date(),
    };

    // Add comment to Firestore
    const guideRef = doc(db, 'guides', guideId);
    await updateDoc(guideRef, {
      comments: arrayUnion(commentData),
    });

    setComments((prevComments) => [...prevComments, commentData]);
    setNewComment('');
  };

  const handleLike = async () => {
    if (!user) return;

    const guideRef = doc(db, 'guides', guideId);
    if (likes.includes(user.uid)) {
      await updateDoc(guideRef, {
        likes: likes.filter((uid) => uid !== user.uid),
      });
      setLikes((prevLikes) => prevLikes.filter((uid) => uid !== user.uid));
    } else {
      await updateDoc(guideRef, {
        likes: arrayUnion(user.uid),
      });
      setLikes((prevLikes) => [...prevLikes, user.uid]);
    }
  };

  if (!guide) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{guide.title}</h1>
      <p className="text-lg text-gray-700 mb-4">Source: {guide.source}</p>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p>{guide.content}</p>
      </div>

      <div className="my-6">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded ${likes.includes(user?.uid) ? 'bg-blue-500' : 'bg-gray-300'} text-white`}
        >
          {likes.includes(user?.uid) ? 'Liked' : 'Like'}
        </button>
        <p>{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {comments.length === 0 && <p>No comments yet.</p>}

        {comments.map((comment, index) => (
          <div key={index} className="mb-4 p-4 border-b">
            <p><strong>User {comment.userId}</strong> says:</p>
            <p>{comment.comment}</p>
          </div>
        ))}

        {user && (
          <div className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
              placeholder="Write a comment..."
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={handleCommentSubmit} // Call the function on comment submit
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Post Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
