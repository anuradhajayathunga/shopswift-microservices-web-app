"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authAPI } from "@/lib/auth";
import { orderAPI } from "@/lib/orders";
import { publicProductAPI, type PublicProduct } from "@/lib/public-products";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);

  const productId = useMemo(() => Number(params.id), [params.id]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!Number.isInteger(productId) || productId <= 0) {
        toast.error("Invalid product id");
        setIsLoading(false);
        return;
      }

      try {
        const data = await publicProductAPI.getById(productId);
        setProduct(data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to load product details",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [productId]);

  const parsedQuantity = Number(quantity);
  const isQuantityValid =
    Number.isInteger(parsedQuantity) && parsedQuantity > 0;

  const handleOrderNow = async () => {
    if (!product) {
      return;
    }

    if (!isQuantityValid) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (parsedQuantity > product.stock) {
      toast.error("Selected quantity exceeds available stock");
      return;
    }

    if (!authAPI.isAuthenticated()) {
      toast.error("Please sign in to place an order");
      router.push(`/signin?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setIsOrdering(true);

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

      await orderAPI.create({
        user_id: userId,
        product_id: product.id,
        quantity: parsedQuantity,
        total_price: product.price * parsedQuantity,
      });

      toast.success("Order placed successfully");
      router.push("/orders");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order",
      );
    } finally {
      setIsOrdering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2" />
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-lg text-center border-border/60">
          <CardContent className="py-10 space-y-4">
            <p className="text-lg font-semibold text-foreground">
              Product not found
            </p>
            <p className="text-sm text-muted-foreground">
              This product may be inactive or no longer available.
            </p>
            <Button asChild>
              <Link href="/store">Back to Store</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          asChild
          variant="ghost"
          className="mb-4 px-2 text-muted-foreground"
        >
          <Link href="/store">
            <ArrowLeft className="size-4 mr-2" />
            Back to Store
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border/60 shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground"
                >
                  {product.sku}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  className="border-border/70 text-muted-foreground"
                >
                  Available stock: {product.stock}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-border/70 text-muted-foreground"
                >
                  Active product
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm h-fit">
            <CardHeader>
              <p className="text-sm text-muted-foreground">Price per item</p>
              <p className="text-3xl font-semibold text-foreground">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product.price)}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  disabled={isOrdering || product.stock <= 0}
                />
              </div>

              <div className="rounded-md bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                Total:{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(
                  product.price * (isQuantityValid ? parsedQuantity : 0),
                )}
              </div>

              <Button
                onClick={handleOrderNow}
                className="w-full gap-2"
                disabled={isOrdering || product.stock <= 0}
              >
                {isOrdering ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-4" />
                    Order Product
                  </>
                )}
              </Button>

              {product.stock <= 0 && (
                <p className="text-xs text-destructive">
                  This product is currently out of stock.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
