"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createReview, fetchReviewsByPark, getReviewStats } from "../services/api";

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const [parkReviews, setParkReviews] = useState({});
  const [loadingReviews, setLoadingReviews] = useState({});

  // Load reviews untuk park tertentu dari API
  const loadReviews = async (parkId) => {
    if (parkReviews[parkId] !== undefined) return; // Sudah di-load
    
    setLoadingReviews((prev) => ({ ...prev, [parkId]: true }));
    try {
      const stats = await getReviewStats(parkId);
      setParkReviews((prev) => ({
        ...prev,
        [parkId]: {
          reviews: stats.reviews,
          averageRating: stats.averageRating,
          totalReviews: stats.totalReviews
        }
      }));
    } catch (error) {
      console.error('Error loading reviews:', error);
      setParkReviews((prev) => ({
        ...prev,
        [parkId]: {
          reviews: [],
          averageRating: 0,
          totalReviews: 0
        }
      }));
    } finally {
      setLoadingReviews((prev) => ({ ...prev, [parkId]: false }));
    }
  };

  // Add review melalui API
  const addReview = async (parkId, name, rating, comment) => {
    try {
      const newReview = await createReview(parkId, name, rating, comment);
      if (newReview) {
        // Reload reviews dari API untuk park ini
        await loadReviews(parkId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  };

  // Get reviews untuk park
  const getReviews = (parkId) => {
    const parkData = parkReviews[parkId];
    return parkData?.reviews || [];
  };

  // Get average rating untuk park
  const getAverageRating = (parkId) => {
    const parkData = parkReviews[parkId];
    return parkData?.averageRating || 0;
  };

  return (
    <ReviewContext.Provider
      value={{
        parkReviews,
        addReview,
        getReviews,
        getAverageRating,
        loadReviews,
        loadingReviews
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within ReviewProvider");
  }
  return context;
}
