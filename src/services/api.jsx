import axios from "axios";

// Create axios instance
export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 error - token expired
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Books API
export const booksApi = {
  getAll: () => api.get("/books"),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post("/books", data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  search: (query) => api.get(`/books/search?query=${query}`),
};

// Members API
export const membersApi = {
  getAll: () => api.get("/members"),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post("/members", data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
};

// Transactions API
export const transactionsApi = {
  getAll: () => api.get("/transactions"),
  getById: (id) => api.get(`/transactions/${id}`),
  getByMember: (memberId) => api.get(`/transactions/member/${memberId}`),
  getByBook: (bookId) => api.get(`/transactions/book/${bookId}`),
  getOverdue: () => api.get("/transactions/overdue"),
  borrow: (data) => api.post("/transactions/borrow", data),
  return: (data) => api.post("/transactions/return", data),
};

// Upload API
export const uploadApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
