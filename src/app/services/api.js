// API Base URL
const API_URL = 'http://localhost:5000/api';

// ============= PARKS API =============
export const fetchParks = async () => {
  try {
    const response = await fetch(`${API_URL}/parks`);
    if (!response.ok) throw new Error('Failed to fetch parks');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching parks:', error);
    return [];
  }
};

export const fetchParkById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/parks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch park');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching park:', error);
    return null;
  }
};

export const fetchParksByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/parks/category/${category}`);
    if (!response.ok) throw new Error('Failed to fetch parks by category');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching parks by category:', error);
    return [];
  }
};

// ============= REVIEWS API =============
export const fetchReviewsByPark = async (parkId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/park/${parkId}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const createReview = async (parkId, name, rating, comment) => {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parkId,
        name,
        rating,
        comment
      })
    });
    if (!response.ok) throw new Error('Failed to create review');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating review:', error);
    return null;
  }
};

export const getReviewStats = async (parkId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/stats/${parkId}`);
    if (!response.ok) throw new Error('Failed to fetch review stats');
    const data = await response.json();
    return {
      averageRating: data.averageRating || 0,
      totalReviews: data.totalReviews || 0,
      reviews: data.data || []
    };
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return {
      averageRating: 0,
      totalReviews: 0,
      reviews: []
    };
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete review');
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
};

// ============= EVENTS API =============
export const fetchEvents = async () => {
  try {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const fetchEventsBySort = async (sort = 'newest') => {
  try {
    const endpoint = sort === 'newest' ? 'newest' : 'oldest';
    const response = await fetch(`${API_URL}/events/sort/${endpoint}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const fetchEventById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`);
    if (!response.ok) throw new Error('Failed to fetch event');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};
