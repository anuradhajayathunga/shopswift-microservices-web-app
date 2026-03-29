from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
from typing import Any, Optional
import os
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from dotenv import load_dotenv

app = FastAPI(title="ShopSwift API Gateway", version="1.0")

DEV_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=DEV_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "shopswift-secret-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

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


def verify_jwt_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = auth_header.split(" ", 1)[1]
    try:
        jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
def read_root():
    return {"message": "ShopSwift API Gateway is running", "services": list(SERVICES.keys())}

# User Service Routes
@app.get("/gateway/users")
async def get_all_users(_: None = Depends(verify_jwt_token)):
    return await forward_request("user", "/api/users", "GET")

@app.get("/gateway/users/{user_id}")
async def get_user_by_id(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("user", f"/api/users/{user_id}", "GET")


@app.post("/gateway/auth/login")
async def login_user(request: Request):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await forward_request("user", "/api/auth/login", "POST", json=payload)

@app.post("/gateway/users")
async def create_user(request: Request):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await forward_request("user", "/api/users", "POST", json=payload)

@app.put("/gateway/users/{user_id}")
async def update_user(user_id: int, request: Request, _: None = Depends(verify_jwt_token)):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await forward_request("user", f"/api/users/{user_id}", "PUT", json=payload)

@app.delete("/gateway/users/{user_id}")
async def delete_user(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("user", f"/api/users/{user_id}", "DELETE")

# Product Service Routes
@app.get("/gateway/products")
async def get_all_products(_: None = Depends(verify_jwt_token)):
    return await forward_request("product", "/api/products", "GET")

@app.get("/gateway/products/{product_id}")
async def get_product_by_id(product_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("product", f"/api/products/{product_id}", "GET")

@app.post("/gateway/products")
async def create_product(request: Request, _: None = Depends(verify_jwt_token)):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await forward_request("product", "/api/products", "POST", json=payload)

@app.put("/gateway/products/{product_id}")
async def update_product(product_id: int, request: Request, _: None = Depends(verify_jwt_token)):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await forward_request("product", f"/api/products/{product_id}", "PUT", json=payload)

@app.delete("/gateway/products/{product_id}")
async def delete_product(product_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("product", f"/api/products/{product_id}", "DELETE")

# Cart Service Routes
@app.get("/gateway/cart/{user_id}")
async def get_user_cart(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("cart", f"/api/cart/{user_id}", "GET")

@app.get("/gateway/cart")
async def get_user_cart_by_query(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("cart", f"/api/cart/{user_id}", "GET")

@app.post("/gateway/cart")
async def add_item_to_cart(request: Request, _: None = Depends(verify_jwt_token)):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await forward_request("cart", "/api/cart", "POST", json=payload)

@app.delete("/gateway/cart/{item_id}")
async def remove_item_from_cart(item_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("cart", f"/api/cart/{item_id}", "DELETE")

# Order Service Routes
@app.get("/gateway/orders")
async def get_all_orders(user_id: Optional[int] = None, _: None = Depends(verify_jwt_token)):
    path = "/api/orders"
    if user_id is not None:
        path = f"/api/orders?user_id={user_id}"
    return await forward_request("order", path, "GET")

@app.get("/gateway/orders/{order_id}")
async def get_order_by_id(order_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("order", f"/api/orders/{order_id}", "GET")

@app.get("/gateway/orders/user/{user_id}")
async def get_orders_by_user(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("order", f"/api/orders/user/{user_id}", "GET")

@app.post("/gateway/orders")
async def create_order(request: Request, _: None = Depends(verify_jwt_token)):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await forward_request("order", "/api/orders", "POST", json=payload)

@app.put("/gateway/orders/{order_id}")
async def update_order(order_id: int, request: Request, _: None = Depends(verify_jwt_token)):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await forward_request("order", f"/api/orders/{order_id}", "PUT", json=payload)

@app.delete("/gateway/orders/{order_id}")
async def delete_order(order_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("order", f"/api/orders/{order_id}", "DELETE")

# Notification Service Routes
@app.get("/gateway/notifications")
async def get_all_notifications(user_id: Optional[int] = None, _: None = Depends(verify_jwt_token)):
    path = "/api/notifications"
    if user_id is not None:
        path = f"/api/notifications?user_id={user_id}"
    return await forward_request("notification", path, "GET")

@app.get("/gateway/notifications/{notification_id}")
async def get_notification_by_id(notification_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("notification", f"/api/notifications/{notification_id}", "GET")

@app.get("/gateway/notifications/user/{user_id}")
async def get_user_notifications(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("notification", f"/api/notifications/user/{user_id}", "GET")

@app.post("/gateway/notifications")
async def create_notification(request: Request, _: None = Depends(verify_jwt_token)):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await forward_request("notification", "/api/notifications", "POST", json=payload)

@app.put("/gateway/notifications/{notification_id}")
async def update_notification(notification_id: int, request: Request, _: None = Depends(verify_jwt_token)):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    return await forward_request("notification", f"/api/notifications/{notification_id}", "PUT", json=payload)

@app.delete("/gateway/notifications/{notification_id}")
async def delete_notification(notification_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("notification", f"/api/notifications/{notification_id}", "DELETE")
