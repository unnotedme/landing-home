// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('username', username);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [username, bookmarks]);

  const login = (name) => setUsername(name);
  const logout = () => setUsername('');

  const toggleBookmark = (guideId) => {
    setBookmarks(prev =>
      prev.includes(guideId) ? prev.filter(id => id !== guideId) : [...prev, guideId]
    );
  };

  return (
    <UserContext.Provider value={{ username, login, logout, bookmarks, toggleBookmark }}>
      {children}
    </UserContext.Provider>
  );
};
