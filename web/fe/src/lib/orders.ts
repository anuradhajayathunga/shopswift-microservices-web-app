import { authAPI } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Order = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
};

export type OrderCreate = {
  user_id: number;
  product_id: number;
  quantity: number;
  total_price: number;
};

export type OrderUpdate = {
  quantity?: number;
  total_price?: number;
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

export const orderAPI = {
  list: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/gateway/orders`, {
      method: "GET",
      headers: buildHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to fetch orders"),
      );
    }

    return response.json();
  },

  getByUser: async (userId: number): Promise<Order[]> => {
    const response = await fetch(
      `${API_BASE_URL}/gateway/orders/user/${userId}`,
      {
        method: "GET",
        headers: buildHeaders(),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to fetch user orders"),
      );
    }

    return response.json();
  },

  getById: async (orderId: number): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/gateway/orders/${orderId}`, {
      method: "GET",
      headers: buildHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Failed to fetch order"));
    }

    return response.json();
  },

  create: async (payload: OrderCreate): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/gateway/orders`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to create order"),
      );
    }

    return response.json();
  },

  update: async (orderId: number, payload: OrderUpdate): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/gateway/orders/${orderId}`, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to update order"),
      );
    }

    return response.json();
  },

  delete: async (orderId: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/gateway/orders/${orderId}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to delete order"),
      );
    }

    return response.json();
  },
};
