from datetime import datetime
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel, Field
from typing import Any, Literal, Optional
import os
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from dotenv import load_dotenv

UserRole = Literal["admin", "customer"]


class ErrorResponse(BaseModel):
    detail: str


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole


class UserBase(BaseModel):
    name: str
    email: str


class UserCreate(UserBase):
    password: str
    role: UserRole = "customer"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[UserRole] = None


class User(UserBase):
    id: int
    role: UserRole


class ProductVariant(BaseModel):
    color: str
    size: str
    images: list[str] = Field(default_factory=list)


class ProductBase(BaseModel):
    name: str
    description: str
    sku: str
    price: float
    stock: int
    is_active: bool = True
    image_url: Optional[str] = None
    tag: Optional[str] = None
    offer_percentage: Optional[float] = Field(default=None, ge=0, le=100)
    sizes: list[str] = Field(default_factory=list)
    variants: list[ProductVariant] = Field(default_factory=list)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None
    tag: Optional[str] = None
    offer_percentage: Optional[float] = Field(default=None, ge=0, le=100)
    sizes: Optional[list[str]] = None
    variants: Optional[list[ProductVariant]] = None


class Product(ProductBase):
    id: int


class CartItemBase(BaseModel):
    user_id: int
    product_id: int
    quantity: int


class CartItemCreate(CartItemBase):
    pass


class CartItem(CartItemBase):
    id: int


class OrderBase(BaseModel):
    user_id: int
    product_id: int
    quantity: int = 1
    total_price: float


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    quantity: Optional[int] = None
    total_price: Optional[float] = None
    status: Optional[str] = None


class Order(OrderBase):
    id: int
    status: str
    created_at: datetime


class NotificationBase(BaseModel):
    user_id: int
    message: str
    type: str = "email"


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(BaseModel):
    message: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None


class Notification(NotificationBase):
    id: int
    status: str
    created_at: datetime


DEFAULT_ERROR_RESPONSES = {
    401: {"model": ErrorResponse, "description": "Unauthorized"},
    404: {"model": ErrorResponse, "description": "Resource not found"},
    422: {"model": ErrorResponse, "description": "Validation error"},
    503: {"model": ErrorResponse, "description": "Service unavailable"},
}


PUBLIC_ROUTE_RESPONSES = {
    404: {"model": ErrorResponse, "description": "Resource not found"},
    422: {"model": ErrorResponse, "description": "Validation error"},
    503: {"model": ErrorResponse, "description": "Service unavailable"},
}

PUBLIC_OPENAPI_OPERATIONS = {
    ("/", "get"),
    ("/gateway/auth/login", "post"),
    ("/gateway/users", "post"),
    ("/gateway/users/admin", "post"),
    ("/gateway/users/customer", "post"),
    ("/gateway/public/products", "get"),
    ("/gateway/public/products/{product_id}", "get"),
}


app = FastAPI(
    title="hype API Gateway",
    version="1.0.0",
    description="Gateway API that proxies User, Product, Cart, Order, and Notification services.",
    openapi_tags=[
        {"name": "Infrastructure", "description": "Gateway health and infrastructure routes."},
        {"name": "User Service", "description": "Proxy routes for User Service (port 8001)."},
        {"name": "Product Service", "description": "Proxy routes for Product Service (port 8002)."},
        {"name": "Cart Service", "description": "Proxy routes for Cart Service (port 8003)."},
        {"name": "Order Service", "description": "Proxy routes for Order Service (port 8004)."},
        {
            "name": "Notification Service",
            "description": "Proxy routes for Notification Service (port 8005).",
        },
    ],
)

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

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "hype.-secret-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

SERVICES = {
    "user": "http://localhost:8001",
    "product": "http://localhost:8002",
    "cart": "http://localhost:8003",
    "order": "http://localhost:8004",
    "notification": "http://localhost:8005"
}


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    openapi_schema["servers"] = [{"url": "/", "description": "Current gateway origin"}]
    openapi_schema.setdefault("components", {})
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT authorization token. Format: Bearer <token>",
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]

    for path, method in PUBLIC_OPENAPI_OPERATIONS:
        if path in openapi_schema.get("paths", {}) and method in openapi_schema["paths"][path]:
            openapi_schema["paths"][path][method]["security"] = []

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

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

@app.get("/", tags=["Infrastructure"])
def read_root():
    return {"message": "hypeAPI Gateway is running", "services": list(SERVICES.keys())}

# User Service Routes
@app.get(
    "/gateway/users",
    tags=["User Service"],
    summary="Get all users",
    response_model=list[User],
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_all_users(_: None = Depends(verify_jwt_token)):
    return await forward_request("user", "/api/users", "GET")

@app.get(
    "/gateway/users/by-email",
    tags=["User Service"],
    summary="Get user by email",
    response_model=User,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_user_by_email(email: str, _: None = Depends(verify_jwt_token)):
    return await forward_request("user", "/api/users/by-email", "GET", params={"email": email})

@app.get(
    "/gateway/users/{user_id}",
    tags=["User Service"],
    summary="Get user by ID",
    response_model=User,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_user_by_id(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("user", f"/api/users/{user_id}", "GET")


@app.post(
    "/gateway/auth/login",
    tags=["User Service"],
    summary="Authenticate user",
    response_model=TokenResponse,
    responses=PUBLIC_ROUTE_RESPONSES,
)
async def login_user(payload: LoginRequest):
    return await forward_request("user", "/api/auth/login", "POST", json=payload.model_dump())

@app.post(
    "/gateway/users",
    tags=["User Service"],
    summary="Create user",
    response_model=User,
    status_code=201,
    responses=PUBLIC_ROUTE_RESPONSES,
)
async def create_user(payload: UserCreate):
    return await forward_request("user", "/api/users", "POST", json=payload.model_dump())


@app.post(
    "/gateway/users/admin",
    tags=["User Service"],
    summary="Create admin user",
    response_model=User,
    status_code=201,
    responses=PUBLIC_ROUTE_RESPONSES,
)
async def create_admin_user(payload: UserCreate):
    return await forward_request("user", "/api/users/admin", "POST", json=payload.model_dump())


@app.post(
    "/gateway/users/customer",
    tags=["User Service"],
    summary="Create customer user",
    response_model=User,
    status_code=201,
    responses=PUBLIC_ROUTE_RESPONSES,
)
async def create_customer_user(payload: UserCreate):
    return await forward_request("user", "/api/users/customer", "POST", json=payload.model_dump())

@app.put(
    "/gateway/users/{user_id}",
    tags=["User Service"],
    summary="Update user",
    response_model=User,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def update_user(user_id: int, payload: UserUpdate, _: None = Depends(verify_jwt_token)):
    return await forward_request("user", f"/api/users/{user_id}", "PUT", json=payload.model_dump(exclude_none=True))

@app.delete(
    "/gateway/users/{user_id}",
    tags=["User Service"],
    summary="Delete user",
    responses=DEFAULT_ERROR_RESPONSES,
)
async def delete_user(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("user", f"/api/users/{user_id}", "DELETE")

# Product Service Routes
@app.get(
    "/gateway/products",
    tags=["Product Service"],
    summary="Get all products",
    response_model=list[Product],
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_all_products(_: None = Depends(verify_jwt_token)):
    return await forward_request("product", "/api/products", "GET")


@app.get(
    "/gateway/public/products",
    tags=["Product Service"],
    summary="Get public products",
    response_model=list[Product],
    responses=PUBLIC_ROUTE_RESPONSES,
)
async def get_public_products():
    return await forward_request("product", "/api/products/public", "GET")


@app.get(
    "/gateway/public/products/{product_id}",
    tags=["Product Service"],
    summary="Get public product by ID",
    response_model=Product,
    responses=PUBLIC_ROUTE_RESPONSES,
)
async def get_public_product_by_id(product_id: int):
    return await forward_request("product", f"/api/products/public/{product_id}", "GET")

@app.get(
    "/gateway/products/{product_id}",
    tags=["Product Service"],
    summary="Get product by ID",
    response_model=Product,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_product_by_id(product_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("product", f"/api/products/{product_id}", "GET")

@app.post(
    "/gateway/products",
    tags=["Product Service"],
    summary="Create product",
    response_model=Product,
    status_code=201,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def create_product(payload: ProductCreate, _: None = Depends(verify_jwt_token)):
    return await forward_request("product", "/api/products", "POST", json=payload.model_dump())

@app.put(
    "/gateway/products/{product_id}",
    tags=["Product Service"],
    summary="Update product",
    response_model=Product,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def update_product(product_id: int, payload: ProductUpdate, _: None = Depends(verify_jwt_token)):
    return await forward_request("product", f"/api/products/{product_id}", "PUT", json=payload.model_dump(exclude_none=True))

@app.delete(
    "/gateway/products/{product_id}",
    tags=["Product Service"],
    summary="Delete product",
    responses=DEFAULT_ERROR_RESPONSES,
)
async def delete_product(product_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("product", f"/api/products/{product_id}", "DELETE")

# Cart Service Routes
@app.get(
    "/gateway/cart/{user_id}",
    tags=["Cart Service"],
    summary="Get cart items by user ID",
    response_model=list[CartItem],
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_user_cart(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("cart", f"/api/cart/{user_id}", "GET")

@app.get(
    "/gateway/cart",
    tags=["Cart Service"],
    summary="Get cart items by user query",
    response_model=list[CartItem],
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_user_cart_by_query(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("cart", f"/api/cart/{user_id}", "GET")

@app.post(
    "/gateway/cart",
    tags=["Cart Service"],
    summary="Add item to cart",
    response_model=CartItem,
    status_code=201,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def add_item_to_cart(payload: CartItemCreate, _: None = Depends(verify_jwt_token)):
    return await forward_request("cart", "/api/cart", "POST", json=payload.model_dump())

@app.delete(
    "/gateway/cart/{item_id}",
    tags=["Cart Service"],
    summary="Remove item from cart",
    responses=DEFAULT_ERROR_RESPONSES,
)
async def remove_item_from_cart(item_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("cart", f"/api/cart/{item_id}", "DELETE")

# Order Service Routes
@app.get(
    "/gateway/orders",
    tags=["Order Service"],
    summary="Get all orders",
    response_model=list[Order],
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_all_orders(user_id: Optional[int] = None, _: None = Depends(verify_jwt_token)):
    path = "/api/orders"
    if user_id is not None:
        return await forward_request("order", path, "GET", params={"user_id": user_id})
    return await forward_request("order", path, "GET")

@app.get(
    "/gateway/orders/{order_id}",
    tags=["Order Service"],
    summary="Get order by ID",
    response_model=Order,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_order_by_id(order_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("order", f"/api/orders/{order_id}", "GET")

@app.get(
    "/gateway/orders/user/{user_id}",
    tags=["Order Service"],
    summary="Get orders by user ID",
    response_model=list[Order],
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_orders_by_user(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("order", f"/api/orders/user/{user_id}", "GET")

@app.post(
    "/gateway/orders",
    tags=["Order Service"],
    summary="Create order",
    response_model=Order,
    status_code=201,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def create_order(payload: OrderCreate, _: None = Depends(verify_jwt_token)):
    return await forward_request("order", "/api/orders", "POST", json=payload.model_dump())

@app.put(
    "/gateway/orders/{order_id}",
    tags=["Order Service"],
    summary="Update order",
    response_model=Order,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def update_order(order_id: int, payload: OrderUpdate, _: None = Depends(verify_jwt_token)):
    return await forward_request("order", f"/api/orders/{order_id}", "PUT", json=payload.model_dump(exclude_none=True))

@app.delete(
    "/gateway/orders/{order_id}",
    tags=["Order Service"],
    summary="Delete order",
    responses=DEFAULT_ERROR_RESPONSES,
)
async def delete_order(order_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("order", f"/api/orders/{order_id}", "DELETE")

# Notification Service Routes
@app.get(
    "/gateway/notifications",
    tags=["Notification Service"],
    summary="Get all notifications",
    response_model=list[Notification],
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_all_notifications(user_id: Optional[int] = None, _: None = Depends(verify_jwt_token)):
    path = "/api/notifications"
    if user_id is not None:
        return await forward_request("notification", path, "GET", params={"user_id": user_id})
    return await forward_request("notification", path, "GET")

@app.get(
    "/gateway/notifications/{notification_id}",
    tags=["Notification Service"],
    summary="Get notification by ID",
    response_model=Notification,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_notification_by_id(notification_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("notification", f"/api/notifications/{notification_id}", "GET")

@app.get(
    "/gateway/notifications/user/{user_id}",
    tags=["Notification Service"],
    summary="Get notifications by user ID",
    response_model=list[Notification],
    responses=DEFAULT_ERROR_RESPONSES,
)
async def get_user_notifications(user_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("notification", f"/api/notifications/user/{user_id}", "GET")

@app.post(
    "/gateway/notifications",
    tags=["Notification Service"],
    summary="Create notification",
    response_model=Notification,
    status_code=201,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def create_notification(payload: NotificationCreate, _: None = Depends(verify_jwt_token)):
    return await forward_request("notification", "/api/notifications", "POST", json=payload.model_dump())

@app.put(
    "/gateway/notifications/{notification_id}",
    tags=["Notification Service"],
    summary="Update notification",
    response_model=Notification,
    responses=DEFAULT_ERROR_RESPONSES,
)
async def update_notification(
    notification_id: int,
    payload: NotificationUpdate,
    _: None = Depends(verify_jwt_token),
):
    return await forward_request(
        "notification",
        f"/api/notifications/{notification_id}",
        "PUT",
        json=payload.model_dump(exclude_none=True),
    )

@app.delete(
    "/gateway/notifications/{notification_id}",
    tags=["Notification Service"],
    summary="Delete notification",
    responses=DEFAULT_ERROR_RESPONSES,
)
async def delete_notification(notification_id: int, _: None = Depends(verify_jwt_token)):
    return await forward_request("notification", f"/api/notifications/{notification_id}", "DELETE")
