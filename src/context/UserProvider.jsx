// src/context/UserProvider.jsx (or UserContext.jsx, if you prefer)
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove,
         collection, addDoc, runTransaction } from 'firebase/firestore';

import { UserContext } from './userAuthContext'; // Import UserContext from its new file

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUsername(userData.username);
          setBookmarks(userData.bookmarks || []);
        } else {
          await setDoc(userDocRef, {
            username: currentUser.displayName || currentUser.email,
            bookmarks: []
          });
          setUsername(currentUser.displayName || currentUser.email);
          setBookmarks([]);
        }
      } else {
        setUsername(null);
        setBookmarks([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      await updateProfile(currentUser, { displayName: displayName });

      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        username: displayName,
        email: email,
        bookmarks: []
      });

      setUser(currentUser);
      setUsername(displayName);
      setBookmarks([]);
      return currentUser;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      return currentUser;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUsername(null);
      setBookmarks([]);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleBookmark = async (guideId) => {
    if (!user) {
      alert("Please log in to bookmark guides.");
      return;
    }
    const userDocRef = doc(db, 'users', user.uid);
    let updatedBookmarks;
    if (bookmarks.includes(guideId)) {
      updatedBookmarks = bookmarks.filter(id => id !== guideId);
      await updateDoc(userDocRef, {
        bookmarks: arrayRemove(guideId)
      });
    } else {
      updatedBookmarks = [...bookmarks, guideId];
      await updateDoc(userDocRef, {
        bookmarks: arrayUnion(guideId)
      });
    }
    setBookmarks(updatedBookmarks);
  };

  const addComment = async (guideId, commentText) => {
     if (!user || !username) {
         alert("Please log in to add a comment.");
         return;
     }
     try {
         const commentsCollectionRef = collection(db, 'guides', String(guideId), 'comments');
         await addDoc(commentsCollectionRef, {
             userId: user.uid,
             username: username,
             comment: commentText,
             createdAt: new Date(),
         });
         console.log("Comment added successfully!");
     } catch (error) {
         console.error("Error adding comment:", error);
         throw error;
     }
  };

  const addOrUpdateRating = async (guideId, rating) => {
     if (!user) {
         alert("Please log in to rate a guide.");
         return;
     }
     const guideRef = doc(db, 'guides', String(guideId));

     try {
         await runTransaction(db, async (transaction) => {
             const guideDoc = await transaction.get(guideRef);

             let currentRatings = guideDoc.exists() && guideDoc.data().ratings ? guideDoc.data().ratings : {};
             let currentTotalRating = guideDoc.exists() && guideDoc.data().totalRating ? guideDoc.data().totalRating : 0;
             let currentRatingCount = guideDoc.exists() && guideDoc.data().ratingCount ? guideDoc.data().ratingCount : 0;

             const oldRating = currentRatings[user.uid];

             if (oldRating) {
                 currentTotalRating = currentTotalRating - oldRating + rating;
             } else {
                 currentTotalRating += rating;
                 currentRatingCount += 1;
             }

             currentRatings[user.uid] = rating;

             transaction.set(guideRef, {
                 ratings: currentRatings,
                 totalRating: currentTotalRating,
                 ratingCount: currentRatingCount,
                 averageRating: currentTotalRating / currentRatingCount,
             }, { merge: true });
         });
         console.log("Rating added/updated successfully!");
     } catch (error) {
         console.error("Error adding/updating rating:", error);
         throw error;
     }
  };

  const value = {
    user,
    username,
    bookmarks,
    loading,
    signup,
    login,
    logout,
    toggleBookmark,
    addComment,
    addOrUpdateRating,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};