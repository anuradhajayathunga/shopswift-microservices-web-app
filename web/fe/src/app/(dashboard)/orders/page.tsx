"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Pencil,
  Plus,
  Trash2,
  ShoppingCart,
  Search,
  RefreshCw,
  ListFilter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  orderAPI,
  type Order,
  type OrderCreate,
  type OrderUpdate,
} from "@/lib/orders";
import { userAPI, type UserSummary } from "@/lib/users";
import { productAPI, type Product } from "@/lib/products";

// --- Types & Validation ---
type OrderFormState = {
  user_id: string;
  product_id: string;
  quantity: string;
  total_price: string;
  status: string;
};

const initialFormState: OrderFormState = {
  user_id: "",
  product_id: "",
  quantity: "1",
  total_price: "",
  status: "pending",
};

const toPayload = (
  form: OrderFormState,
  isUpdate: boolean,
): OrderCreate | OrderUpdate => {
  if (isUpdate) {
    return {
      quantity: Number(form.quantity) || undefined,
      total_price: Number(form.total_price) || undefined,
      status: form.status || "pending",
    };
  }
  return {
    user_id: Number(form.user_id),
    product_id: Number(form.product_id),
    quantity: Number(form.quantity),
    total_price: Number(form.total_price),
  };
};

const validateForm = (form: OrderFormState, isUpdate: boolean = false) => {
  if (!isUpdate) {
    if (!form.user_id.trim()) return "User ID is required";
    if (!form.product_id.trim()) return "Product ID is required";
  }

  const quantity = Number(form.quantity);
  if (!Number.isInteger(quantity) || quantity <= 0)
    return "Quantity must be greater than 0";

  const totalPrice = Number(form.total_price);
  if (isNaN(totalPrice) || totalPrice < 0)
    return "Total price must be a valid number";

  return null;
};

// Premium tinted colors for SaaS look
const statusOptions = [
  {
    label: "Pending",
    value: "pending",
    color:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/50",
  },
  {
    label: "Processing",
    value: "processing",
    color:
      "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/50",
  },
  {
    label: "Completed",
    value: "completed",
    color:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/50",
  },
  {
    label: "Cancelled",
    value: "cancelled",
    color:
      "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/50",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState<OrderFormState>(initialFormState);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Action States
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ROWS_PER_PAGE = 8;

  const isEditing = useMemo(() => editingOrderId !== null, [editingOrderId]);

  // Create lookup maps
  const userMap = useMemo(
    () =>
      users.reduce(
        (map, user) => {
          map[user.id] = user.name;
          return map;
        },
        {} as Record<number, string>,
      ),
    [users],
  );

  const productMap = useMemo(
    () =>
      products.reduce(
        (map, product) => {
          map[product.id] = product.name;
          return map;
        },
        {} as Record<number, string>,
      ),
    [products],
  );

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        `${order.id}`.includes(searchTerm) ||
        `${order.user_id}`.includes(searchTerm) ||
        (userMap[order.user_id] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        `${order.product_id}`.includes(searchTerm) ||
        (productMap[order.product_id] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [orders, searchTerm, userMap, productMap]);

  const totalPages = Math.ceil(filteredOrders.length / ROWS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const startIdx = (currentPage - 1) * ROWS_PER_PAGE;
    const endIdx = startIdx + ROWS_PER_PAGE;
    return filteredOrders.slice(startIdx, endIdx);
  }, [filteredOrders, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const loadOrders = useCallback(async () => {
    try {
      const data = await orderAPI.list();
      setOrders(data);
      setCurrentPage(1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load orders",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUsersAndProducts = useCallback(async () => {
    try {
      const [usersData, productsData] = await Promise.all([
        userAPI.list(),
        productAPI.list(),
      ]);
      setUsers(usersData);
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to load users and products:", error);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
    void loadUsersAndProducts();
  }, [loadOrders, loadUsersAndProducts]);

  const resetForm = () => {
    setForm(initialFormState);
    setEditingOrderId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingOrderId(null);
    setForm(initialFormState);
    setShowForm(true);
  };

  const handleChange =
    (key: keyof OrderFormState) =>
    (event: React.ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof event === "string" ? event : event.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const handleEdit = (order: Order) => {
    setEditingOrderId(order.id);
    setForm({
      user_id: String(order.user_id),
      product_id: String(order.product_id),
      quantity: String(order.quantity),
      total_price: String(order.total_price),
      status: order.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm(form, isEditing);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        const payload = toPayload(form, true) as OrderUpdate;
        await orderAPI.update(editingOrderId!, payload);
        toast.success("Order updated successfully");
      } else {
        const payload = toPayload(form, false) as OrderCreate;
        await orderAPI.create(payload);
        toast.success("Order created successfully");
      }
      resetForm();
      await loadOrders();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save order",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (order: Order) => {
    if (!window.confirm(`Are you sure you want to delete order #${order.id}?`))
      return;

    setDeletingOrderId(order.id);
    try {
      await orderAPI.delete(order.id);
      toast.success("Order deleted successfully");
      await loadOrders();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete order",
      );
    } finally {
      setDeletingOrderId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    if (!statusOption) {
      return (
        <Badge
          variant="secondary"
          className="bg-muted dark:muted/10 text-foreground font-medium shadow-none border-0"
        >
          {status}
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className={`${statusOption.color} shadow-none font-medium border-0`}
      >
        {statusOption.label}
      </Badge>
    );
  };

  return (
    <div className="mx-auto space-y-6 pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb className="mb-1.5">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Link href="/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground">
                  Orders
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer orders, track status, and handle fulfillment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => loadOrders()}
            variant="outline"
            size="sm"
            className="h-9 gap-2 shadow-sm text-muted-foreground bg-background border-border/60"
          >
            <RefreshCw className="size-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            onClick={openCreateForm}
            size="sm"
            className="h-9 gap-2 shadow-sm"
          >
            <Plus className="size-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Order Form Modal */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) resetForm();
          else setShowForm(true);
        }}
      >
        <DialogContent className="sm:max-w-[500px] p-0 border-border/60 shadow-xl overflow-hidden">
          <div className="px-6 pt-6 pb-4 bg-muted/30 dark:bg-muted/5">
            <DialogHeader>
              <DialogTitle className="text-xl ">
                {isEditing ? "Edit Order details" : "Create New Order"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the status, quantity, or total price for this order."
                  : "Enter the customer and product IDs to initiate a new order."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 space-y-5 pb-6">
              {!isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="user_id"
                      className="text-xs font-semibold uppercase text-muted-foreground"
                    >
                      User ID
                    </Label>
                    <Input
                      id="user_id"
                      type="number"
                      min="1"
                      value={form.user_id}
                      onChange={handleChange("user_id")}
                      placeholder="e.g. 1042"
                      disabled={isSubmitting}
                      className="shadow-none font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="product_id"
                      className="text-xs font-semibold uppercase text-muted-foreground"
                    >
                      Product ID
                    </Label>
                    <Input
                      id="product_id"
                      type="number"
                      min="1"
                      value={form.product_id}
                      onChange={handleChange("product_id")}
                      placeholder="e.g. 883"
                      disabled={isSubmitting}
                      className="shadow-none font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="quantity"
                    className="text-xs font-semibold uppercase text-muted-foreground"
                  >
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="1"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange("quantity")}
                    placeholder="1"
                    disabled={isSubmitting}
                    className=" shadow-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="total_price"
                    className="text-xs font-semibold uppercase text-muted-foreground"
                  >
                    Total Price (LKR)
                  </Label>
                  <Input
                    id="total_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.total_price}
                    onChange={handleChange("total_price")}
                    placeholder="0.00"
                    disabled={isSubmitting}
                    className=" shadow-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="status"
                  className="text-xs font-semibold uppercase text-muted-foreground"
                >
                  Fulfillment Status
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => handleChange("status")(value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="shadow-none">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="px-6 py-4  border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="shadow-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px] shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Create Order"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Data Table Container */}
      <Card className="border-border/60 shadow-sm dark:shadow-dark-sm bg-background overflow-hidden rounded-xl">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-border/60 bg-muted/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order, User, Product..."
              className="pl-9 h-9 bg-background shadow-sm border-border/60 transition-colors focus-visible:ring-1 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-xs text-muted-foreground font-medium shrink-0">
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1 ? "Order" : "Orders"}
            </div>
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <span className="text-xs text-muted-foreground font-medium">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 bg-background shadow-sm text-muted-foreground border-border/60"
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || totalPages === 0}
                title="Previous page"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 bg-background shadow-sm text-muted-foreground border-border/60"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                title="Next page"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary/60 mb-4" />
              <p className="text-sm">Loading fulfillment data...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingCart className="size-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No orders yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                When customers place orders, they will appear here. You can also
                manually create one to test the flow.
              </p>
              <Button
                onClick={openCreateForm}
                variant="outline"
                className="shadow-sm border-border/60"
              >
                <Plus className="size-4 mr-2" />
                Create First Order
              </Button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Search className="size-8 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-foreground">
                No matching records found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search query.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-border/60">
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Order
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      User
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Product
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                      Qty
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                      Total
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Date
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right w-[100px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="group hover:bg-muted/40 hover:dark:bg-muted/10 transition-colors border-b-border/50"
                    >
                      <TableCell className="px-5 py-3.5 font-semibold text-foreground">
                        #{order.id}
                      </TableCell>
                      <TableCell className="px-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sm text-foreground">
                            {userMap[order.user_id] || "Unknown"}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            ID: {order.user_id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sm text-foreground">
                            {productMap[order.product_id] || "Unknown"}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            ID: {order.product_id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 text-right font-medium">
                        {order.quantity}
                      </TableCell>
                      <TableCell className="px-5 text-right font-medium text-foreground">
                        {new Intl.NumberFormat("en-LK", {
                          style: "currency",
                          currency: "LKR",
                        }).format(order.total_price)}
                      </TableCell>
                      <TableCell className="px-5">
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="px-5 text-xs text-muted-foreground font-medium">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(order.created_at))}
                      </TableCell>
                      <TableCell className="px-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-8 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => handleEdit(order)}
                            disabled={
                              isSubmitting || deletingOrderId === order.id
                            }
                            title="Edit Order"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={() => handleDelete(order)}
                            disabled={
                              isSubmitting || deletingOrderId === order.id
                            }
                            title="Delete Order"
                          >
                            {deletingOrderId === order.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
