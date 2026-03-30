const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type AuthUser = {
  id?: number;
  name?: string;
  email?: string;
};

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

  getUserByEmail: async (email: string): Promise<AuthUser> => {
    const token = authAPI.getToken();
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await fetch(
      `${API_BASE_URL}/gateway/users/by-email?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.detail || "Failed to fetch user details");
    }

    return response.json();
  },

  saveToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },

  saveUser: (user: AuthUser) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(user));
    }
  },

  getUser: (): AuthUser | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const rawUser = localStorage.getItem("auth_user");
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem("auth_user");
      return null;
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
      localStorage.removeItem("auth_user");
    }
  },

  isAuthenticated: () => {
    return !!authAPI.getToken();
  },
};
