from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import httpx
from typing import Any

app = FastAPI(title="ShopSwift API Gateway", version="1.0")

SERVICES = {
    "user": "http://localhost:8001",
    "product": "http://localhost:8002",
    "cart": "http://localhost:8003",
    "order": "http://localhost:8004",
    "notification": "http://localhost:8005"
}

async def forward_request(service: str, path: str, method: str, **kwargs) -> Any:
    if service not in SERVICES:
        raise HTTPException(status_code=404, detail="Service not found")
    url = f"{SERVICES[service]}{path}"
    async with httpx.AsyncClient() as client:
        try:
            if method == "GET":
                response = await client.get(url, **kwargs)
            elif method == "POST":
                response = await client.post(url, **kwargs)
            elif method == "PUT":
                response = await client.put(url, **kwargs)
            elif method == "DELETE":
                response = await client.delete(url, **kwargs)
            else:
                raise HTTPException(status_code=405, detail="Method not allowed")
            return JSONResponse(
                content=response.json() if response.text else None,
                status_code=response.status_code
            )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "ShopSwift API Gateway is running", "services": list(SERVICES.keys())}

# Add routes for all services (example for user and product - add others similarly)
@app.get("/gateway/users")
async def get_all_users():
    return await forward_request("user", "/api/users", "GET")

# ... (repeat for all endpoints you need - I can give full gateway code if you want)

@app.get("/gateway/products")
async def get_all_products():
    return await forward_request("product", "/api/products", "GET")

@app.get("/gateway/cart")
async def get_user_cart(user_id: int):
    return await forward_request("cart", f"/api/cart/{user_id}", "GET")