import { authAPI } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type CartItem = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
};

export type CartItemPayload = {
  user_id: number;
  product_id: number;
  quantity: number;
};

export type CartUpdatedDetail = {
  delta?: number;
  refresh?: boolean;
};

export const CART_UPDATED_EVENT = "cart-updated";

export const notifyCartUpdated = (detail: CartUpdatedDetail = {}) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail }));
  }
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

export const cartAPI = {
  list: async (userId: number): Promise<CartItem[]> => {
    const response = await fetch(`${API_BASE_URL}/gateway/cart/${userId}`, {
      method: "GET",
      headers: buildHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Failed to fetch cart"));
    }

    return response.json();
  },

  add: async (payload: CartItemPayload): Promise<CartItem> => {
    const response = await fetch(`${API_BASE_URL}/gateway/cart`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Failed to add to cart"));
    }

    return response.json();
  },

  remove: async (itemId: number): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/gateway/cart/${itemId}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to remove cart item"),
      );
    }

    return response.json();
  },
};
