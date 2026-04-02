import { authAPI } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Notification = {
  id: number;
  user_id: number;
  message: string;
  type: string;
  status: string;
  created_at: string;
};

export type NotificationCreate = {
  user_id: number;
  message: string;
  type: string;
};

export type NotificationUpdate = {
  message?: string;
  type?: string;
  status?: string;
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

export const notificationAPI = {
  list: async (userId?: number): Promise<Notification[]> => {
    const query = userId ? `?user_id=${userId}` : "";
    const response = await fetch(
      `${API_BASE_URL}/gateway/notifications${query}`,
      {
        method: "GET",
        headers: buildHeaders(),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to fetch notifications"),
      );
    }

    return response.json();
  },

  getById: async (notificationId: number): Promise<Notification> => {
    const response = await fetch(
      `${API_BASE_URL}/gateway/notifications/${notificationId}`,
      {
        method: "GET",
        headers: buildHeaders(),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to fetch notification"),
      );
    }

    return response.json();
  },

  getByUser: async (userId: number): Promise<Notification[]> => {
    const response = await fetch(
      `${API_BASE_URL}/gateway/notifications/user/${userId}`,
      {
        method: "GET",
        headers: buildHeaders(),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to fetch user notifications"),
      );
    }

    return response.json();
  },

  create: async (payload: NotificationCreate): Promise<Notification> => {
    const response = await fetch(`${API_BASE_URL}/gateway/notifications`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to create notification"),
      );
    }

    return response.json();
  },

  update: async (
    notificationId: number,
    payload: NotificationUpdate,
  ): Promise<Notification> => {
    const response = await fetch(
      `${API_BASE_URL}/gateway/notifications/${notificationId}`,
      {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to update notification"),
      );
    }

    return response.json();
  },

  delete: async (notificationId: number): Promise<{ message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/gateway/notifications/${notificationId}`,
      {
        method: "DELETE",
        headers: buildHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to delete notification"),
      );
    }

    return response.json();
  },
};
