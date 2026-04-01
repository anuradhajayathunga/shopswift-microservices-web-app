"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authAPI } from "@/lib/auth";
import { cartAPI, notifyCartUpdated, type CartItem } from "@/lib/cart";
import { publicProductAPI, type PublicProduct } from "@/lib/public-products";

type CartLineItem = CartItem & {
  product: PublicProduct | null;
};

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const resolveUserId = useCallback(async () => {
    if (!authAPI.isAuthenticated()) {
      return null;
    }

    const user = authAPI.getUser();
    let userId = user?.id;

    if (!userId && user?.email) {
      const fullUser = await authAPI.getUserByEmail(user.email);
      authAPI.saveUser(fullUser);
      userId = fullUser.id;
    }

    return userId ?? null;
  }, []);

  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price = item.product?.price ?? 0;
      return total + price * item.quantity;
    }, 0);
  }, [items]);

  useEffect(() => {
    const loadCart = async () => {
      if (!open) {
        return;
      }

      if (!authAPI.isAuthenticated()) {
        setItems([]);
        return;
      }

      let userId: number | null;

      try {
        userId = await resolveUserId();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to load cart",
        );
        setItems([]);
        return;
      }

      if (!userId) {
        setItems([]);
        return;
      }

      setIsLoading(true);

      try {
        const cartItems = await cartAPI.list(userId);
        const cartWithProducts = await Promise.all(
          cartItems.map(async (item) => {
            try {
              const product = await publicProductAPI.getById(item.product_id);
              return { ...item, product };
            } catch {
              return { ...item, product: null };
            }
          }),
        );

        setItems(cartWithProducts);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to load cart",
        );
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadCart();
  }, [open, resolveUserId]);

  const handleRemoveItem = async (itemId: number) => {
    try {
      const removedItem = items.find((item) => item.id === itemId);
      await cartAPI.remove(itemId);
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId),
      );
      if (removedItem) {
        notifyCartUpdated({ delta: -removedItem.quantity });
      } else {
        notifyCartUpdated({ refresh: true });
      }
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to remove item",
      );
    }
  };

  const handleQuantityChange = async (item: CartLineItem, delta: 1 | -1) => {
    setPendingItemId(item.id);

    try {
      if (delta === -1 && item.quantity === 1) {
        await cartAPI.remove(item.id);
        setItems((currentItems) =>
          currentItems.filter((currentItem) => currentItem.id !== item.id),
        );
        notifyCartUpdated({ delta: -1 });
        return;
      }

      const updatedItem = await cartAPI.add({
        user_id: item.user_id,
        product_id: item.product_id,
        quantity: delta,
      });

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, quantity: updatedItem.quantity }
            : currentItem,
        ),
      );
      notifyCartUpdated({ delta });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update quantity",
      );
    } finally {
      setPendingItemId(null);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) {
      return;
    }

    setOpen(false);
    router.push("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground transition-colors hover:text-foreground"
        >
          <ShoppingBag className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col border-l border-border/50 p-0 sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/40 px-6 py-5 text-left">
          <SheetTitle className="text-lg font-medium tracking-tight text-foreground">
            Shopping cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {!authAPI.isAuthenticated() ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
              <h2 className="mb-3 text-2xl font-medium tracking-tight text-foreground">
                Sign in to view your cart
              </h2>
              <p className="mb-8 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                Add products to your cart after signing in so we can fetch your
                saved items from the backend.
              </p>

              <Button
                asChild
                variant="outline"
                className="h-11 rounded-md border-border/60 px-8 font-medium transition-colors hover:bg-muted/50 group"
              >
                <Link href="/signin">
                  Go to sign in
                  <ArrowUpRight className="ml-2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                </Link>
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex h-full items-center justify-center p-6 text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading cart...
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
              <h2 className="mb-3 text-2xl font-medium tracking-tight text-foreground">
                Your cart is empty
              </h2>
              <p className="mb-8 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
                You may check out all the available products and buy some in the
                shop
              </p>

              <SheetTrigger asChild>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-md border-border/60 px-8 font-medium transition-colors hover:bg-muted/50 group"
                >
                  <Link href="/store">
                    Return to shop
                    <ArrowUpRight className="ml-2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </Link>
                </Button>
              </SheetTrigger>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-border/50 bg-background p-4 shadow-sm"
                >
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src="/api/placeholder/120/160"
                      alt={item.product?.name || `Product ${item.product_id}`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <p className="line-clamp-1 text-sm font-semibold text-foreground">
                        {item.product?.name || "Product unavailable"}
                      </p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {item.product?.description ||
                          `SKU item #${item.product_id}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        Rs {(item.product?.price ?? 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-md border border-border/60 bg-background">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none rounded-l-md text-muted-foreground hover:text-foreground"
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={pendingItemId === item.id}
                        >
                          -
                        </Button>
                        <span className="min-w-10 px-3 text-center text-sm font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none rounded-r-md text-muted-foreground hover:text-foreground"
                          onClick={() => handleQuantityChange(item, 1)}
                          disabled={pendingItemId === item.id}
                        >
                          +
                        </Button>
                      </div>

                      <span className="text-xs text-muted-foreground">
                        Subtotal Rs{" "}
                        {(
                          (item.product?.price ?? 0) * item.quantity
                        ).toLocaleString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="mr-1 size-3.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="sticky bottom-0 space-y-4 border-t border-border/40 bg-background/95 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Cart total</span>
                  <span className="font-semibold text-foreground">
                    Rs {cartTotal.toLocaleString()}
                  </span>
                </div>

                <Button
                  className="h-11 w-full font-medium"
                  onClick={() => void handleCheckout()}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Placing order...
                    </>
                  ) : (
                    "Proceed to checkout"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
