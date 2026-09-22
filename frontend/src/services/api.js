const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get auth header with JWT token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic response handler
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

// --- AUTH API ---
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// --- UPLOAD API ---
export const uploadImage = async (file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  return handleResponse(response);
};

// --- DONOR FOOD API ---
export const createFood = async (foodData) => {
  const response = await fetch(`${API_BASE_URL}/foods`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(foodData),
  });
  return handleResponse(response);
};

export const getMyDonations = async () => {
  const response = await fetch(`${API_BASE_URL}/foods/my-donations`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getFoodById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const updateFood = async (id, foodData) => {
  const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(foodData),
  });
  return handleResponse(response);
};

export const deleteFood = async (id) => {
  const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// --- RECIPIENT API ---
export const getAvailableFoods = async () => {
  const response = await fetch(`${API_BASE_URL}/recipient/available`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const claimFood = async (foodId) => {
  const response = await fetch(`${API_BASE_URL}/recipient/claim/${foodId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const getMyClaims = async () => {
  const response = await fetch(`${API_BASE_URL}/recipient/my-claims`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
