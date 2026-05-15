// API Base URL
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;
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
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ parkId, name, rating, comment }),
    });
    if (!response.ok) {
      const err = await response.json();
      console.error('Review error:', err);
      throw new Error('Failed to create review');
    }
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

// ============= BOOKMARKS API =============
export const fetchBookmarks = async (sessionId) => {
  try {
    const response = await fetch(`${API_URL}/bookmarks/${sessionId}`);
    if (!response.ok) throw new Error('Failed to fetch bookmarks');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
};

export const addBookmark = async (sessionId, parkId) => {
  try {
    const response = await fetch(`${API_URL}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, parkId })
    });
    if (!response.ok) throw new Error('Failed to add bookmark');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return null;
  }
};

export const removeBookmark = async (sessionId, parkId) => {
  try {
    const response = await fetch(`${API_URL}/bookmarks/${sessionId}/${parkId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove bookmark');
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
};

// ============= AUTH API =============
const getAuthHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('rhj_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const googleLogin = async (credential) => {
  try {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });
    if (!response.ok) throw new Error('Failed to login');
    return await response.json();
  } catch (error) {
    console.error('Error during Google login:', error);
    return null;
  }
};

export const getMe = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

// ============= ADMIN API =============
export const getAdminStats = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
    });
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return null;
  }
};

export const getAdminUsers = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/admin/users?page=${page}&limit=${limit}`, {
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return null;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ role })
    });
    if (!response.ok) throw new Error('Failed to update role');
    return await response.json();
  } catch (error) {
    console.error('Error updating user role:', error);
    return null;
  }
};



export const uploadImage = async (file, folder = "general", token) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload?folder=${folder}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Jangan tambah Content-Type di sini!
      },
      body: formData,
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload gagal");
  return data.url;
};