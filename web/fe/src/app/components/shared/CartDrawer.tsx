"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ShoppingBag,
  X,
  RefreshCw,
  Truck,
  PlusIcon,
  MinusIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { authAPI } from "@/lib/auth";
import { cartAPI, notifyCartUpdated, type CartItem } from "@/lib/cart";
import { publicProductAPI, type PublicProduct } from "@/lib/public-products";

type CartLineItem = CartItem & {
  product: PublicProduct | null;
};

type CartDrawerProps = {
  cartCount?: number;
};

export function CartDrawer({ cartCount = 0 }: CartDrawerProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  const resolveUserId = useCallback(async () => {
    if (!authAPI.isAuthenticated()) return null;
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
      if (!open) return;
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
      if (removedItem) notifyCartUpdated({ delta: -removedItem.quantity });
      else notifyCartUpdated({ refresh: true });
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
        await handleRemoveItem(item.id);
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
    if (items.length === 0 || isCheckingOut) return;
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }
    setOpen(false);
    router.push("/store/checkout");
  };

  const handleViewCart = () => {
    setOpen(false);
    router.push("/cart");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="hover:text-slate-500 transition-colors relative">
          <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-foreground p-1.5 text-center text-[10px] font-medium leading-none text-background">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </div>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col p-0 sm:max-w-[420px] dark:bg-white border-l-0 shadow-2xl font-sans text-gray-900 [&>button]:hidden">
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          <SheetTitle className="text-xl dark:text-back font-medium tracking-wide">
            Shopping cart
          </SheetTitle>
          <SheetClose className="text-gray-500 hover:text-gray-900 !bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent data-[state=open]:!bg-transparent shadow-none transition-colors">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </SheetClose>
        </SheetHeader>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          {!authAPI.isAuthenticated() ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <h2 className="mb-2 text-lg font-medium text-gray-900">
                Sign in to view cart
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Log in to see items you've added previously.
              </p>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-gray-300 hover:bg-gray-50 h-12 px-8"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex h-full items-center justify-center p-6 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <h2 className="mb-2 text-lg font-medium text-gray-900">
                Your cart is empty
              </h2>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="mt-4 rounded-none border-gray-300 hover:bg-gray-50 h-12 px-8"
                >
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Cart Items List */}
              <div className="p-6 space-y-6 flex-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-5">
                    {/* Product Image */}
                    <div className="h-[120px] w-[90px] shrink-0 bg-gray-100 overflow-hidden">
                      <img
                        src={
                          item.product?.image_url ||
                          "/images/products/product-placeholder.jpg"
                        }
                        alt={item.product?.name || "Product"}
                        className="h-full w-full object-cover mix-blend-multiply"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col pt-1 flex-1">
                      <p className="text-sm font-medium tracking-wide uppercase text-gray-900">
                        {item.product?.name || "Product Unavailable"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Grey Green / 2XL
                      </p>

                      <p className="text-sm font-medium mt-2">
                        Rs{" "}
                        {(item.product?.price ?? 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>

                      {/* Controls */}
                      <div className="flex items-center gap-4 mt-auto pt-4">
                        <div className="flex items-center gap-4 text-sm">
                          <button
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={pendingItemId === item.id}
                            className="text-gray-500 hover:text-gray-900 px-1 disabled:opacity-50"
                          >
                            <MinusIcon className="w-4 h-4" strokeWidth={2} />
                          </button>
                          <span className="w-2 text-center text-md font-bold select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            disabled={pendingItemId === item.id}
                            className="text-gray-500 hover:text-gray-900 px-1 disabled:opacity-50"
                          >
                            <PlusIcon className="w-4 h-4" strokeWidth={2} />
                          </button>
                        </div>

                        <div
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-all ml-4"
                        >
                          Remove
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Section */}
              <div className="mt-auto px-6 pb-6 pt-4 bg-white">
                {/* Info Icons */}
                <div className="flex justify-center gap-12 mb-8 text-gray-600">
                  <RefreshCw className="w-5 h-5" strokeWidth={1.5} />
                  <Truck className="w-6 h-6" strokeWidth={1.5} />
                </div>

                {/* Subtotal */}
                <div className="flex items-end justify-between mb-2">
                  <span className="text-lg text-gray-900">Subtotal</span>
                  <span className="text-lg font-medium text-gray-900">
                    Rs{" "}
                    {cartTotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    LKR
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  Taxes and{" "}
                  <span className="underline underline-offset-4 decoration-gray-300">
                    shipping
                  </span>{" "}
                  calculated at checkout
                </p>

                {/* Terms Checkbox */}
                <label className="flex items-center gap-3 mb-6 cursor-pointer">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${agreedToTerms ? "border-gray-900 bg-gray-900" : "border-gray-300"}`}
                  >
                    {agreedToTerms && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <span className="text-sm text-gray-900">
                    I agree with the{" "}
                    <span className="font-bold underline underline-offset-4">
                      terms and conditions
                    </span>
                  </span>
                </label>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-none border-gray-300 text-gray-900 font-medium hover:bg-gray-50 shadow-none text-base"
                    onClick={handleViewCart}
                  >
                    View cart
                  </Button>
                  <Button
                    className="w-full h-12 rounded-none bg-red-800 text-white hover:bg-slate-800 border border-gray-300 font-medium shadow-none text-base"
                    onClick={() => void handleCheckout()}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Check out"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
