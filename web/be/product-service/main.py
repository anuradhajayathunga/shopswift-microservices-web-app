from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from schemas import Product, ProductCreate, ProductUpdate
from crud import (
    get_all_products,
    get_active_product,
    get_active_products,
    get_product,
    get_product_by_sku,
    create_product,
    delete_product, 
    update_product,)
from typing import List

Base.metadata.create_all(bind=engine)


def ensure_product_schema() -> None:
    inspector = inspect(engine)
    if not inspector.has_table("products"):
        return

    columns = {column["name"] for column in inspector.get_columns("products")}
    alter_statements = []

    if "is_active" not in columns:
        alter_statements.append(
            "ALTER TABLE products ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT 1"
        )

    if "image_url" not in columns:
        alter_statements.append(
            "ALTER TABLE products ADD COLUMN image_url TEXT"
        )

    if "tag" not in columns:
        alter_statements.append(
            "ALTER TABLE products ADD COLUMN tag TEXT"
        )

    if "offer_percentage" not in columns:
        alter_statements.append(
            "ALTER TABLE products ADD COLUMN offer_percentage REAL"
        )

    if not alter_statements:
        return

    with engine.begin() as connection:
        for statement in alter_statements:
            connection.execute(text(statement))


ensure_product_schema()

app = FastAPI(title="Product Service", version="1.0")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Product Service is running"}

@app.get("/api/products", response_model=List[Product])
def get_products(db: Session = Depends(get_db)):
    return get_all_products(db)


@app.get("/api/products/public", response_model=List[Product])
def get_public_products(db: Session = Depends(get_db)):
    return get_active_products(db)


@app.get("/api/products/public/{product_id}", response_model=Product)
def get_public_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = get_active_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/api/products/{product_id}", response_model=Product)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/products", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product_endpoint(product: ProductCreate, db: Session = Depends(get_db)):
    existing = get_product_by_sku(db, product.sku)
    if existing:
        raise HTTPException(status_code=400, detail="SKU already exists")
    return create_product(db, product)

@app.put("/api/products/{product_id}", response_model=Product)
def update_product_endpoint(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    updated = update_product(db, product_id, product)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated

@app.delete("/api/products/{product_id}")
def delete_product_endpoint(product_id: int, db: Session = Depends(get_db)):
    success = delete_product(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}