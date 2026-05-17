"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchBookmarks, addBookmark, removeBookmark } from "@/app/services/api";
import { useAuth } from "@/app/context/AuthContext";

export function useBookmark() {
  const { isAuthenticated } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setBookmarks([]);
      return;
    }
    fetchBookmarks().then(setBookmarks);
  }, [isAuthenticated]);

  const toggleBookmark = useCallback(async (parkId) => {
    const id = String(parkId);
    if (bookmarks.includes(id)) {
      setBookmarks(prev => prev.filter(b => b !== id));
      await removeBookmark(id);
    } else {
      setBookmarks(prev => [...prev, id]);
      await addBookmark(id);
    }
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (parkId) => bookmarks.includes(String(parkId)),
    [bookmarks]
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}