"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Loader2,
  Minus,
  Plus,
  Truck,
  RefreshCw,
  ShieldCheck,
  Share2,
  MessageCircleQuestion,
  Box,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Mock data based on the screenshot
const PRODUCT_COLORS = [
  { name: "Grey Green", hex: "#8F9E93", image: "/images/products/product-01.jpg" },
  { name: "Light Blue", hex: "#A8DADC", image: "/images/products/product-02.jpg" }
];
const PRODUCT_SIZES = ["2XL", "XL", "L", "M", "S"];
const PRODUCT_IMAGES = [
  "/images/products/product-01.jpg",
  "/images/products/product-02.jpg",
  "/images/products/product-03.jpg",
  "/images/products/product-04.jpg",
  "/images/products/product-05.jpg",
];

const PRODUCT_DETAILS_TABLE = [
  { label: "Material", value: "Single Jersey Material" },
  { label: "Fabric Composition", value: "230 GSM/ Cotton 100%" },
  { label: "Style", value: "Casual Street style" },
  { label: "Neckline", value: "RIB Fabric (Contrast Color)" },
  { label: "Fit Type", value: "Regular Oversize style" },
  { label: "Print Type", value: "Screen Print" },
  { label: "Care Instruction", value: "Hand Gentle wash & iron inside out" },
  { label: "Product Code", value: "DTE" },
];

const SIZE_GUIDE = [
  { size: "S", chest: "22", length: "26", sleeve: "9.5", shoulder: "17.5" },
  { size: "M", chest: "23.5", length: "26.5", sleeve: "9.5", shoulder: "18.5" },
  { size: "L", chest: "24", length: "28", sleeve: "10.5", shoulder: "19.5" },
  { size: "XL", chest: "25.5", length: "28.5", sleeve: "10.5", shoulder: "20.5" },
  { size: "2XL", chest: "26", length: "30", sleeve: "11", shoulder: "22" },
];

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const productId = useMemo(() => Number(params.id), [params.id]);

  const [selectedColor, setSelectedColor] = useState(PRODUCT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState("2XL");
  const [quantity, setQuantity] = useState(1);
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
    name: product?.name ?? "BACKYARD GRAPHIC T",
    price: product?.price ?? 4650,
    images: PRODUCT_IMAGES,
    stock: product?.stock ?? 10,
    sku: product?.sku ?? "DTE",
  };

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
    if (type === "inc" && quantity < productView.stock) setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    if (!product || !Number.isInteger(productId) || productId <= 0) return;

    setIsAddingToCart(true);

    try {
      const user = authAPI.getUser();
      let userId = user?.id;

      if (!userId && user?.email) {
        const fullUser = await authAPI.getUserByEmail(user.email);
        authAPI.saveUser(fullUser);
        userId = fullUser.id;
      }

      if (!userId) throw new Error("Unable to identify current user");

      await cartAPI.add({
        user_id: userId,
        product_id: product.id,
        quantity: quantity,
      });

      notifyCartUpdated({ delta: quantity });
      toast.success("Added to cart successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-slate-900">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6 text-xs uppercase tracking-wider">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-muted-foreground hover:text-foreground transition-colors">
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                {productView.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 xl:gap-16 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-6">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 shrink-0 pb-2 md:pb-0 scrollbar-hide">
              {productView.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-[3/4] w-20 md:w-full overflow-hidden border transition-all ${
                    activeImage === img ? "border-slate-900 opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="object-cover w-full h-full bg-slate-100" />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <div className="relative flex-1 aspect-[3/4] w-full bg-slate-100 overflow-hidden">
              <img
                src={activeImage}
                alt={productView.name}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col space-y-6">
            
            {/* Title & Price */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight uppercase">
                {productView.name}
              </h1>
              <div className="space-y-1">
                <span className="text-2xl font-normal">
                  Rs {productView.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <p className="text-sm text-muted-foreground">
                  3 installments of Rs {(productView.price / 3).toLocaleString("en-US", { minimumFractionDigits: 2 })} or 6% Cashback with <span className="font-bold text-slate-800">mintpay</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  or pay in 3 x Rs {(productView.price / 3).toLocaleString("en-US", { minimumFractionDigits: 2 })} with <span className="font-bold text-[#8c67f6]">KOKO</span>
                </p>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <div className="text-sm">
                Color: <span className="font-medium">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {PRODUCT_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-14 h-16 border overflow-hidden transition-all ${
                      selectedColor.name === color.name
                        ? "border-slate-900 p-0.5"
                        : "border-border hover:border-slate-400"
                    }`}
                    title={color.name}
                  >
                    <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="text-sm">
                Size: <span className="font-medium">{selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRODUCT_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 px-6 border text-sm transition-colors ${
                      selectedSize === size
                        ? "border-slate-900 text-slate-900 font-medium"
                        : "border-border text-slate-500 hover:border-slate-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Badge variant="outline" className="rounded-sm font-normal text-xs uppercase tracking-wider py-1 px-3">New</Badge>
                <Badge variant="outline" className="rounded-sm font-normal text-xs uppercase tracking-wider py-1 px-3">Online</Badge>
                <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-100 rounded-sm font-normal text-xs py-1 px-3 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Instock, ready to ship
                </Badge>
              </div>
            </div>

            {/* Product Details Table */}
            <div className="pt-4 pb-2 border-b border-t border-slate-100 mt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2 inline-block border-slate-900">
                Product Details
              </h3>
              <div className="border border-slate-200 divide-y divide-slate-200 text-sm">
                {PRODUCT_DETAILS_TABLE.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-2 divide-x divide-slate-200">
                    <div className="p-3 text-muted-foreground bg-slate-50/50">{row.label}</div>
                    <div className="p-3 font-medium">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4 pt-4">
              <div className="text-sm font-medium">Quantity</div>
              <div className="flex items-center w-32 h-12 border border-slate-200">
                <button
                  onClick={() => handleQuantityChange("dec")}
                  className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 h-full flex items-center justify-center font-medium text-sm border-x border-slate-100">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange("inc")}
                  className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  disabled={quantity >= productView.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Box className="w-4 h-4 text-green-600" />
                <span className="text-slate-900 text-xs">Pickup available at <span className="font-semibold">No. 282, Park Road, Colombo 05</span> Usually ready in 1 hour</span>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-6 py-2 text-xs font-medium text-slate-600">
                <button className="flex items-center gap-2 hover:text-slate-900 transition-colors"><Droplets className="w-4 h-4"/> Compare color</button>
                <button className="flex items-center gap-2 hover:text-slate-900 transition-colors"><MessageCircleQuestion className="w-4 h-4"/> Ask a question</button>
                <button className="flex items-center gap-2 hover:text-slate-900 transition-colors"><Truck className="w-4 h-4"/> Delivery & Return</button>
                <button className="flex items-center gap-2 hover:text-slate-900 transition-colors"><Share2 className="w-4 h-4"/> Share</button>
              </div>

              {/* Add to Cart / Buy Now Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  variant="secondary"
                  className="w-full h-12 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium tracking-wide shadow-none"
                  onClick={() => void handleAddToCart()}
                  disabled={isAddingToCart || productView.stock <= 0}
                >
                  {isAddingToCart ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                  ) : (
                    `Add to cart - Rs ${(productView.price * quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  )}
                </Button>
                
                {/* Custom Teal Button matching screenshot */}
                <Button
                  className="w-full h-12 rounded-none bg-[#4A8E9A] hover:bg-[#3d7781] text-white font-medium tracking-widest uppercase shadow-none"
                >
                  Buy It Now
                </Button>
              </div>
            </div>

            {/* Size Guide Section */}
            <div className="pt-10 space-y-6 flex flex-col items-center border-t border-slate-100 mt-6">
              <h2 className="text-2xl tracking-widest uppercase font-medium">Size Guide</h2>
              <div className="w-full max-w-md border border-slate-200 rounded-sm overflow-hidden text-sm">
                <div className="grid grid-cols-5 bg-black text-white text-center font-medium">
                  <div className="p-3 border-r border-slate-700">SIZE</div>
                  <div className="p-3 border-r border-slate-700">CHEST</div>
                  <div className="p-3 border-r border-slate-700">LENGTH</div>
                  <div className="p-3 border-r border-slate-700">SLEEVE</div>
                  <div className="p-3">SHOULDER</div>
                </div>
                {SIZE_GUIDE.map((row, idx) => (
                  <div key={idx} className={`grid grid-cols-5 text-center ${idx % 2 !== 0 ? 'bg-slate-50' : 'bg-white'} border-t border-slate-200`}>
                    <div className="p-3 bg-black text-white font-medium border-r border-slate-700">{row.size}</div>
                    <div className="p-3 border-r border-slate-200">{row.chest}</div>
                    <div className="p-3 border-r border-slate-200">{row.length}</div>
                    <div className="p-3 border-r border-slate-200">{row.sleeve}</div>
                    <div className="p-3">{row.shoulder}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground max-w-sm leading-relaxed">
                *** All measurements are in inches.<br/>
                Please note that these measurements are approximate and may vary slightly. The oversized fit of these t-shirts is designed for a relaxed and comfortable fit. If you're between sizes or prefer a looser fit, we recommend going up a size.
              </p>
            </div>

            {/* Delivery Info Boxes */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex flex-col items-center text-center p-6 border border-slate-200 bg-slate-50/50 space-y-3">
                <Truck className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
                <span className="text-xs text-slate-600">
                  Island-wide Cash-on-Delivery <span className="font-bold text-slate-900">350 LKR</span><br/>(within 1-3 working days)
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-6 border border-slate-200 bg-slate-50/50 space-y-3">
                <RefreshCw className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
                <span className="text-xs text-slate-600">
                  Exchange within <span className="font-bold text-slate-900">7 days</span> of purchase.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 border border-slate-200 mt-4 bg-slate-50/50">
               <ShieldCheck className="w-4 h-4 text-slate-600" />
               <span className="text-xs font-medium uppercase tracking-wide mr-2">Guarantee Safe Checkout</span>
               {/* Placeholders for payment icons */}
               <div className="flex gap-2">
                 <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold italic">VISA</div>
                 <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[8px] text-white font-bold relative overflow-hidden">
                    <div className="w-3 h-3 bg-red-500 rounded-full absolute -left-0.5"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full absolute -right-0.5"></div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}