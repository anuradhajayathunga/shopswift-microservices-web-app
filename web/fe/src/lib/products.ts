import { authAPI } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Product = {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  is_active: boolean;
};

export type ProductPayload = {
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  is_active?: boolean;
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

export const productAPI = {
  list: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/gateway/products`, {
      method: "GET",
      headers: buildHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to fetch products"),
      );
    }

    return response.json();
  },

  create: async (payload: ProductPayload): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/gateway/products`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to create product"),
      );
    }

    return response.json();
  },

  update: async (
    productId: number,
    payload: Partial<ProductPayload>,
  ): Promise<Product> => {
    const response = await fetch(
      `${API_BASE_URL}/gateway/products/${productId}`,
      {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to update product"),
      );
    }

    return response.json();
  },

  remove: async (productId: number): Promise<{ message: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/gateway/products/${productId}`,
      {
        method: "DELETE",
        headers: buildHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to delete product"),
      );
    }

    return response.json();
  },
};
