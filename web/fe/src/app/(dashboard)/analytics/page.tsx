"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart3,
  CircleCheckBig,
  CircleDashed,
  Package,
  RefreshCw,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Progress } from "@/components/ui/progress";
import { productAPI, type Product } from "@/lib/products";
import { orderAPI, type Order } from "@/lib/orders";
import { userAPI, type UserSummary } from "@/lib/users";

const LOW_STOCK_THRESHOLD = 10;

const statusToneMap: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  processing: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  completed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
};

const getMonthLabel = (dateValue: string) => {
  const date = new Date(dateValue);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
  }).format(date);
};

const getRevenueLabel = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);

    try {
      const [ordersData, productsData, usersData] = await Promise.all([
        orderAPI.list(),
        productAPI.list(),
        userAPI.list(),
      ]);

      setOrders(ordersData);
      setProducts(productsData);
      setUsers(usersData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load analytics",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.total_price,
      0,
    );
    const completedOrders = orders.filter(
      (order) => order.status === "completed",
    );
    const pendingOrders = orders.filter((order) => order.status === "pending");
    const cancelledOrders = orders.filter(
      (order) => order.status === "cancelled",
    );
    const totalItemsSold = orders.reduce(
      (sum, order) => sum + order.quantity,
      0,
    );

    const lowStockProducts = products.filter(
      (product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD,
    );
    const outOfStockProducts = products.filter(
      (product) => product.stock === 0,
    );
    const activeProducts = products.filter((product) => product.is_active);

    const orderStatusBreakdown = [
      "pending",
      "processing",
      "completed",
      "cancelled",
    ].map((status) => ({
      status,
      count: orders.filter((order) => order.status === status).length,
    }));

    const monthlyRevenue = orders.reduce<Record<string, number>>(
      (acc, order) => {
        const month = getMonthLabel(order.created_at);
        acc[month] = (acc[month] || 0) + order.total_price;
        return acc;
      },
      {},
    );

    const revenueSeries = Object.entries(monthlyRevenue)
      .map(([month, value]) => ({ month, value }))
      .sort((left, right) => left.month.localeCompare(right.month))
      .slice(-6);

    const topProducts = orders.reduce<
      Record<
        number,
        { product: Product | null; quantity: number; revenue: number }
      >
    >((acc, order) => {
      if (!acc[order.product_id]) {
        acc[order.product_id] = {
          product:
            products.find((product) => product.id === order.product_id) || null,
          quantity: 0,
          revenue: 0,
        };
      }

      acc[order.product_id].quantity += order.quantity;
      acc[order.product_id].revenue += order.total_price;
      return acc;
    }, {});

    const topProductSeries = Object.values(topProducts)
      .filter((entry) => entry.product)
      .sort((left, right) => right.quantity - left.quantity)
      .slice(0, 5);

    return {
      totalRevenue,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalItemsSold,
      lowStockProducts,
      outOfStockProducts,
      activeProducts,
      orderStatusBreakdown,
      revenueSeries,
      topProductSeries,
    };
  }, [orders, products]);

  const chartMaxRevenue = Math.max(
    1,
    ...analytics.revenueSeries.map((entry) => entry.value),
  );

  const chartMaxOrders = Math.max(
    1,
    ...analytics.topProductSeries.map((entry) => entry.quantity),
  );

  return (
    <div className="mx-auto space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                  Analytics
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A compact view of sales, orders, and stock health across the store.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 bg-background shadow-sm"
            asChild
          >
            <Link href="/products">
              <Store className="size-4" />
              Manage products
            </Link>
          </Button>
          <Button
            onClick={() => void loadAnalytics()}
            className="gap-2 shadow-sm"
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border/60 shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
              <BadgeDollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">
              {getRevenueLabel(analytics.totalRevenue)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Combined value of all recorded orders.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-500/10 text-sky-600">
              <ShoppingCart className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">
              {orders.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {analytics.completedOrders.length} completed and{" "}
              {analytics.pendingOrders.length} pending.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Package className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">
              {products.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {analytics.activeProducts.length} active listings in the catalog.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customers
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-500/10 text-violet-600">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">
              {users.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Registered users available in the dashboard.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-border/60 shadow-sm bg-background overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/20 dark:bg-muted/0 ">
            <CardTitle className="text-lg font-semibold text-foreground">
              Revenue trend
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly order value from the recorded order timeline.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                Loading analytics...
              </div>
            ) : analytics.revenueSeries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <BarChart3 className="mb-3 size-10 text-primary/70" />
                <p className="font-medium text-foreground">
                  No revenue data yet
                </p>
                <p className="mt-1 text-sm">
                  Orders will appear here once sales start coming in.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {analytics.revenueSeries.map((entry) => {
                    const height = Math.max(
                      18,
                      Math.round((entry.value / chartMaxRevenue) * 100),
                    );

                    return (
                      <div
                        key={entry.month}
                        className="rounded-xl border border-border/60 bg-muted/20 p-4"
                      >
                        <div className="mb-3 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {entry.month}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Monthly revenue
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            {getRevenueLabel(entry.value)}
                          </p>
                        </div>
                        <div className="h-28 rounded-lg bg-background p-3 border border-border/50 flex items-end">
                          <div
                            className="w-full rounded-md bg-gradient-to-t from-primary/75 via-sky-400/80 to-emerald-400/90 shadow-sm transition-all"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-background overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/20 dark:bg-muted/0 ">
            <CardTitle className="text-lg font-semibold text-foreground">
              Order status
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribution of order lifecycle states.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {analytics.orderStatusBreakdown.map((item) => {
              const percent =
                orders.length === 0 ? 0 : (item.count / orders.length) * 100;
              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${statusToneMap[item.status] || "bg-muted text-muted-foreground"} border-0`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.count}
                    </p>
                  </div>
                  <Progress value={percent} className="h-2" />
                </div>
              );
            })}

            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CircleCheckBig className="size-4 text-emerald-600" />
                Fulfillment summary
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-background p-3 border border-border/50">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    Completed
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {analytics.completedOrders.length}
                  </p>
                </div>
                <div className="rounded-lg bg-background p-3 border border-border/50">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    Pending
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {analytics.pendingOrders.length}
                  </p>
                </div>
                <div className="rounded-lg bg-background p-3 border border-border/50">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    Cancelled
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {analytics.cancelledOrders.length}
                  </p>
                </div>
                <div className="rounded-lg bg-background p-3 border border-border/50">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">
                    Items sold
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {analytics.totalItemsSold}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border-border/60 shadow-sm bg-background overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/20 dark:bg-muted/0 ">
            <CardTitle className="text-lg font-semibold text-foreground">
              Product performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Top products by ordered quantity.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {analytics.topProductSeries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                <ShoppingCart className="mb-3 size-10 text-sky-500/70" />
                <p className="font-medium text-foreground">
                  No order performance yet
                </p>
                <p className="mt-1 text-sm">
                  Top products will show up after orders are placed.
                </p>
              </div>
            ) : (
              analytics.topProductSeries.map((entry) => {
                const percent = Math.max(
                  10,
                  Math.round((entry.quantity / chartMaxOrders) * 100),
                );

                return (
                  <div
                    key={entry.product?.id}
                    className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {entry.product?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SKU {entry.product?.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {entry.quantity} sold
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getRevenueLabel(entry.revenue)}
                        </p>
                      </div>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-background overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/20 dark:bg-muted/0 ">
            <CardTitle className="text-lg font-semibold text-foreground">
              Stock health
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              A quick read on how much of the catalog needs attention.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <AlertTriangle className="size-4 text-amber-600" />
                  Low stock
                </div>
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  {analytics.lowStockProducts.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Products at or below {LOW_STOCK_THRESHOLD} units.
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <CircleDashed className="size-4 text-rose-600" />
                  Out of stock
                </div>
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  {analytics.outOfStockProducts.length}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Products that need immediate replenishment.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Healthy catalog share
                </span>
                <span className="font-medium text-foreground">
                  {products.length === 0
                    ? "0%"
                    : `${Math.round(
                        ((products.length -
                          analytics.lowStockProducts.length -
                          analytics.outOfStockProducts.length) /
                          products.length) *
                          100,
                      )}%`}
                </span>
              </div>
              <Progress
                value={
                  products.length === 0
                    ? 0
                    : ((products.length -
                        analytics.lowStockProducts.length -
                        analytics.outOfStockProducts.length) /
                        products.length) *
                      100
                }
                className="h-2"
              />
            </div>

            <div className="rounded-xl border border-border/60 bg-gradient-to-br from-muted/20 to-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ArrowUpRight className="size-4 text-primary" />
                Snapshot
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                The catalog currently has {products.length} products,{" "}
                {analytics.activeProducts.length} active listings, and{" "}
                {users.length} users connected to the store.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
