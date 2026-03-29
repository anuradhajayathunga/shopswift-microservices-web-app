from typing import List, Optional
import httpx
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from schemas import Order, OrderCreate, OrderUpdate
from crud import get_all_orders, get_order, create_order, update_order, delete_order

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Order Service", version="1.0")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Order Service is running"}


@app.get("/api/orders", response_model=List[Order])
def get_orders(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    return get_all_orders(db, user_id=user_id)


@app.get("/api/orders/{order_id}", response_model=Order)
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.get("/api/orders/user/{user_id}", response_model=List[Order])
def get_orders_by_user(user_id: int, db: Session = Depends(get_db)):
    orders = get_all_orders(db, user_id=user_id)
    if not orders:
        raise HTTPException(status_code=404, detail="No orders found for this user")
    return orders


@app.post("/api/orders", response_model=Order, status_code=status.HTTP_201_CREATED)
def create_order_endpoint(order: OrderCreate, db: Session = Depends(get_db)):
    user_data = None
    with httpx.Client() as client:
        user_resp = client.get(f"http://localhost:8001/api/users/{order.user_id}")
        if user_resp.status_code != 200:
            raise HTTPException(status_code=404, detail="User not found")
        user_data = user_resp.json()

        product_resp = client.get(f"http://localhost:8002/api/products/{order.product_id}")
        if product_resp.status_code != 200:
            raise HTTPException(status_code=404, detail="Product not found")

    created_order = create_order(db, order)

    # Fire-and-forget style notification: order creation stays successful even if notification service is unavailable.
    user_email = user_data.get("email", "unknown-email") if isinstance(user_data, dict) else "unknown-email"
    notification_payload = {
        "user_id": created_order.user_id,
        "message": (
            f"Order #{created_order.id} placed successfully for {user_email}. "
            f"Product ID: {created_order.product_id}, Quantity: {created_order.quantity}, "
            f"Total: {created_order.total_price}."
        ),
        "type": "email"
    }
    try:
        with httpx.Client() as client:
            client.post("http://localhost:8005/api/notifications", json=notification_payload)
    except httpx.RequestError:
        pass

    return created_order


@app.put("/api/orders/{order_id}", response_model=Order)
def update_order_endpoint(order_id: int, order: OrderUpdate, db: Session = Depends(get_db)):
    updated = update_order(db, order_id, order)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated


@app.delete("/api/orders/{order_id}")
def delete_order_endpoint(order_id: int, db: Session = Depends(get_db)):
    success = delete_order(db, order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted"}
