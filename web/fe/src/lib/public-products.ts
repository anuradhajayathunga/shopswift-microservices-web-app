const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type PublicProduct = {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  is_active: boolean;
  image_url?: string | null;
  tag?: string | null;
  offer_percentage?: number | null;
};

const getErrorMessage = async (response: Response, fallback: string) => {
  const payload = await response.json().catch(() => null);
  return payload?.detail || fallback;
};

export const publicProductAPI = {
  list: async (): Promise<PublicProduct[]> => {
    const response = await fetch(`${API_BASE_URL}/gateway/public/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to fetch products"),
      );
    }

    return response.json();
  },

  getById: async (productId: number): Promise<PublicProduct> => {
    const response = await fetch(
      `${API_BASE_URL}/gateway/public/products/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(response, "Failed to fetch product details"),
      );
    }

    return response.json();
  },
};
