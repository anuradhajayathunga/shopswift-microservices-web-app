export const TOKEN_STORAGE_KEY = "shopswift_jwt_token";

export function getGatewayUrl() {
  const rawUrl =
    import.meta.env.VITE_GATEWAY_URL || "http://localhost:8000/gateway";
  return rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
}

export function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
