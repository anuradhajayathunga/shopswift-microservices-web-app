import { authAPI, type UserRole } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type UserSummary = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

const buildHeaders = () => {
  const token = authAPI.getToken();

  if (!token) {
    throw new Error("No auth token found");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const getErrorMessage = async (response: Response, fallback: string) => {
  const payload = await response.json().catch(() => null);
  return payload?.detail || fallback;
};

export const userAPI = {
  list: async (): Promise<UserSummary[]> => {
    const response = await fetch(`${API_BASE_URL}/gateway/users`, {
      method: "GET",
      headers: buildHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Failed to fetch users"));
    }

    return response.json();
  },
};
