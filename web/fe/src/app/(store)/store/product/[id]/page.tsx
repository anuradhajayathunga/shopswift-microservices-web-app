"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Loader2,
  Star,
  Truck,
  RefreshCw,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Header from "@/app/components/store/Header";
import { authAPI } from "@/lib/auth";
import { cartAPI, notifyCartUpdated } from "@/lib/cart";
import { publicProductAPI, type PublicProduct } from "@/lib/public-products";
import { toast } from "sonner";

const PRODUCT_COLORS = ["#111827", "#F3F4F6", "#78716C"];
const PRODUCT_SIZES = ["S", "M", "L", "XL", "XXL"];
const PRODUCT_IMAGES = [
  "/images/products/product-01.jpg",
  "/images/products/product-02.jpg",
  "/images/products/product-03.jpg",
  "/images/products/product-04.jpg",
];

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const productId = useMemo(() => Number(params.id), [params.id]);

  const [selectedColor, setSelectedColor] = useState(PRODUCT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(PRODUCT_SIZES[2]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(PRODUCT_IMAGES[0]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!Number.isInteger(productId) || productId <= 0) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await publicProductAPI.getById(productId);
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [productId]);

  const productView = {
    id: product?.id ?? productId,
    name: product?.name ?? "Backline Authority Heavyweight T-Shirt",
    price: product?.price ?? 4950,
    originalPrice: product?.price
      ? Number((product.price * 1.12).toFixed(2))
      : 5500,
    description:
      product?.description ||
      "Experience premium comfort with our heavyweight cotton blend. Designed for the modern streetwear aesthetic, featuring a relaxed drop-shoulder fit and high-density puff print graphics.",
    colors: PRODUCT_COLORS,
    sizes: PRODUCT_SIZES,
    images: PRODUCT_IMAGES,
    stock: product?.stock ?? 0,
    sku: product?.sku ?? "N/A",
    isActive: product?.is_active ?? false,
  };

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    if (!Number.isInteger(productId) || productId <= 0) {
      return;
    }

    setIsAddingToCart(true);

    try {
      const user = authAPI.getUser();
      let userId = user?.id;

      if (!userId && user?.email) {
        const fullUser = await authAPI.getUserByEmail(user.email);
        authAPI.saveUser(fullUser);
        userId = fullUser.id;
      }

      if (!userId) {
        throw new Error("Unable to identify current user");
      }

      await cartAPI.add({
        user_id: userId,
        product_id: product.id,
        quantity: selectedQuantity,
      });

      notifyCartUpdated({ delta: selectedQuantity });

      toast.success("Added to cart successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add to cart",
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {/* <BreadcrumbSeparator /> */}
            {/* <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <Link href="/collections/mens">Men's Tops</Link>
              </BreadcrumbLink>
            </BreadcrumbItem> */}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                {productView.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image Container */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/30 flex items-center justify-center">
              <Badge
                variant="secondary"
                className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-md shadow-sm border-border/50 font-medium"
              >
                Best Seller
              </Badge>
              <img
                src={activeImage}
                alt={productView.name}
                className="object-cover w-full h-full transition-opacity duration-300"
              />
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-4">
              {productView.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-[4/5] overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === img
                      ? "border-primary ring-1 ring-primary/20"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="object-cover w-full h-full opacity-90 hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col pt-2 lg:pt-8">
            {/* Title & Price */}
            <div className="mb-6 space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {productView.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold text-foreground">
                  Rs {productView.price.toLocaleString()}
                </span>
                {productView.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      Rs {productView.originalPrice.toLocaleString()}
                    </span>
                    <Badge
                      variant="destructive"
                      className="font-semibold shadow-none rounded-sm"
                    >
                      Save{" "}
                      {Math.round(
                        (1 - productView.price / productView.originalPrice) *
                          100,
                      )}
                      %
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading product details...</span>
                  </>
                ) : (
                  <>
                    <span>SKU: {productView.sku}</span>
                    <span>•</span>
                    <span>
                      {productView.isActive ? "Active" : "Inactive"} product
                    </span>
                    <span>•</span>
                    <span>Stock: {productView.stock}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span>(128 Reviews)</span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              {productView.description}
            </p>

            <Separator className="mb-8 border-border/60" />

            {/* Options Form */}
            <div className="space-y-8 mb-8">
              {/* Color Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Color
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {productView.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === color
                          ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                          : "border-border/50 hover:border-border"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Size
                  </span>
                  <button className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-4">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {productView.sizes.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 w-full shadow-none ${
                        selectedSize === size
                          ? "bg-foreground text-background font-semibold"
                          : "bg-background border-border/60 text-foreground hover:border-foreground/50 hover:bg-muted/50"
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Quantity
                </span>
                <span className="text-xs text-muted-foreground">
                  {productView.stock > 0
                    ? `${productView.stock} available`
                    : "Out of stock"}
                </span>
              </div>
              <select
                value={selectedQuantity}
                onChange={(event) =>
                  setSelectedQuantity(Number(event.target.value))
                }
                disabled={productView.stock <= 0}
                className="h-12 w-full rounded-md border border-border/60 bg-background px-4 text-sm text-foreground shadow-none outline-none transition-colors focus:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {Array.from(
                  {
                    length: Math.max(1, Math.min(productView.stock || 1, 10)),
                  },
                  (_, index) => index + 1,
                ).map((quantity) => (
                  <option key={quantity} value={quantity}>
                    {quantity}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              <Button
                size="lg"
                className="flex-1 h-14 text-base font-semibold shadow-sm"
                onClick={() => void handleAddToCart()}
                disabled={isAddingToCart || productView.stock <= 0}
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  `Add ${selectedQuantity} to Cart`
                )}
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-14 w-14 border-border/60 shadow-none text-muted-foreground hover:text-red-500 hover:border-red-500/50 hover:bg-red-50 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-muted/20 text-center space-y-2">
                <Truck className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Island-wide
                  <br />
                  Delivery
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-muted/20 text-center space-y-2">
                <RefreshCw className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  7 Days
                  <br />
                  Easy Return
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/50 bg-muted/20 text-center space-y-2">
                <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Secure
                  <br />
                  Checkout
                </span>
              </div>
            </div>

            {/* Product Details Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details" className="border-border/60">
                <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary transition-colors">
                  Product Details
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm space-y-2 leading-relaxed">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>100% Premium Heavyweight Cotton</li>
                    <li>Oversized drop-shoulder fit</li>
                    <li>High-density puff print graphic on front/back</li>
                    <li>Ribbed crewneck collar</li>
                    <li>Pre-shrunk to minimize shrinkage</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-border/60">
                <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary transition-colors">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm space-y-2 leading-relaxed">
                  Standard delivery takes 2-4 business days. Express next-day
                  delivery is available at checkout for selected areas. Returns
                  are accepted within 7 days of receiving your order, provided
                  the items are unworn and in original condition.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care" className="border-border/60">
                <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary transition-colors">
                  Care Instructions
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm space-y-2 leading-relaxed">
                  Machine wash cold with like colors. Tumble dry low or hang dry
                  to preserve the print quality. Do not iron directly over the
                  graphics.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
