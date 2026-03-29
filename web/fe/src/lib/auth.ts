const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const authAPI = {
  signup: async (email: string, password: string, full_name: string) => {
    const response = await fetch(`${API_BASE_URL}/gateway/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: full_name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Sign up failed");
    }
    return response.json();
  },

  signin: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/gateway/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Sign in failed");
    }
    return response.json();
  },

  saveToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },

  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  clearToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },

  isAuthenticated: () => {
    return !!authAPI.getToken();
  },
};
