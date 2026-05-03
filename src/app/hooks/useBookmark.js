"use client";

import { useReducer, useEffect, useCallback } from "react";

const STORAGE_KEY = "park_bookmarks";
const BOOKMARK_EVENT = "bookmark-changed";

function getStored() {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "TOGGLE": {
      const updated = state.includes(action.parkId)
        ? state.filter((id) => id !== action.parkId)
        : [...state, action.parkId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event(BOOKMARK_EVENT));
      return updated;
    }
    default:
      return state;
  }
}

export function useBookmark() {
  const [bookmarks, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    dispatch({ type: "SET", payload: getStored() });

    const handler = () => dispatch({ type: "SET", payload: getStored() });
    window.addEventListener(BOOKMARK_EVENT, handler);
    return () => window.removeEventListener(BOOKMARK_EVENT, handler);
  }, []);

  const toggleBookmark = useCallback((parkId) => {
    dispatch({ type: "TOGGLE", parkId });
  }, []);

  const isBookmarked = useCallback(
    (parkId) => bookmarks.includes(parkId),
    [bookmarks]
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}