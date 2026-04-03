from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional, List


class ProductVariant(BaseModel):
    color: str = Field(min_length=1)
    size: str = Field(min_length=1)
    images: List[str] = Field(default_factory=list, min_length=1, max_length=3)

    @field_validator("color", "size")
    @classmethod
    def strip_and_validate(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Value cannot be empty")
        return normalized

    @field_validator("images")
    @classmethod
    def validate_images(cls, value: List[str]) -> List[str]:
        normalized = [item.strip() for item in value if item and item.strip()]
        if len(normalized) == 0:
            raise ValueError("At least one image is required per variant")
        if len(normalized) > 3:
            raise ValueError("A maximum of 3 images is allowed per variant")
        return normalized

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
    sizes: List[str] = Field(default_factory=list)
    variants: List[ProductVariant] = Field(default_factory=list)

    @field_validator("sizes")
    @classmethod
    def validate_sizes(cls, value: List[str]) -> List[str]:
        normalized = [item.strip() for item in value if item and item.strip()]
        unique_sizes: List[str] = []
        seen = set()
        for size in normalized:
            key = size.lower()
            if key not in seen:
                unique_sizes.append(size)
                seen.add(key)
        return unique_sizes

    @model_validator(mode="after")
    def validate_unique_color_size_variants(self):
        seen = set()
        available_sizes = {size.lower() for size in self.sizes}
        for variant in self.variants:
            key = (variant.color.lower(), variant.size.lower())
            if key in seen:
                raise ValueError("Duplicate color-size variant is not allowed")
            if available_sizes and variant.size.lower() not in available_sizes:
                raise ValueError(
                    f"Variant size '{variant.size}' is not in product sizes list"
                )
            seen.add(key)
        return self

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
    sizes: Optional[List[str]] = None
    variants: Optional[List[ProductVariant]] = None

    @field_validator("sizes")
    @classmethod
    def validate_sizes(cls, value: Optional[List[str]]) -> Optional[List[str]]:
        if value is None:
            return None

        normalized = [item.strip() for item in value if item and item.strip()]
        unique_sizes: List[str] = []
        seen = set()
        for size in normalized:
            key = size.lower()
            if key not in seen:
                unique_sizes.append(size)
                seen.add(key)
        return unique_sizes

    @model_validator(mode="after")
    def validate_unique_color_size_variants(self):
        if self.variants is None:
            return self

        seen = set()
        available_sizes = {size.lower() for size in (self.sizes or [])}
        for variant in self.variants:
            key = (variant.color.lower(), variant.size.lower())
            if key in seen:
                raise ValueError("Duplicate color-size variant is not allowed")
            if available_sizes and variant.size.lower() not in available_sizes:
                raise ValueError(
                    f"Variant size '{variant.size}' is not in product sizes list"
                )
            seen.add(key)
        return self

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True