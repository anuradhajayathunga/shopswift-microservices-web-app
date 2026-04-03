"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CircleAlert,
  Layers3,
  PackageOpen,
  PackageSearch,
  RefreshCw,
  Search,
  Store,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { productAPI, type Product } from "@/lib/products";

type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";

const LOW_STOCK_THRESHOLD = 10;

const getStockState = (stock: number) => {
  if (stock === 0) {
    return {
      label: "Out of stock",
      badgeClass:
        "bg-rose-100 text-rose-800 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900 border-0",
      rowClass: "border-rose-200/70 bg-rose-50/40 dark:bg-rose-950/10",
      icon: PackageOpen,
    };
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return {
      label: `Low stock (${stock})`,
      badgeClass:
        "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900 border-0",
      rowClass: "border-amber-200/70 bg-amber-50/40 dark:bg-amber-950/10",
      icon: AlertTriangle,
    };
  }

  return {
    label: `In stock (${stock})`,
    badgeClass:
      "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900 border-0",
    rowClass: "border-border/50",
    icon: PackageSearch,
  };
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StockFilter>("all");

  const loadInventory = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await productAPI.list();
      setProducts(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load inventory",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const inventorySummary = useMemo(() => {
    const totalProducts = products.length;
    const totalUnits = products.reduce(
      (sum, product) => sum + product.stock,
      0,
    );
    const outOfStockProducts = products.filter(
      (product) => product.stock === 0,
    );
    const lowStockProducts = products.filter(
      (product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD,
    );
    const healthyProducts = products.filter(
      (product) => product.stock > LOW_STOCK_THRESHOLD,
    );

    return {
      totalProducts,
      totalUnits,
      outOfStockProducts,
      lowStockProducts,
      healthyProducts,
    };
  }, [products]);

  const maxStock = useMemo(
    () => Math.max(1, ...products.map((product) => product.stock)),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => {
        if (!query) return true;

        return [product.name, product.sku, product.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      })
      .filter((product) => {
        if (filter === "all") return true;
        if (filter === "out-of-stock") return product.stock === 0;
        if (filter === "low-stock") {
          return product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
        }

        return product.stock > LOW_STOCK_THRESHOLD;
      })
      .sort(
        (left, right) =>
          left.stock - right.stock || left.name.localeCompare(right.name),
      );
  }, [filter, products, search]);

  const filterOptions: Array<{
    value: StockFilter;
    label: string;
    count: number;
  }> = [
    { value: "all", label: "All items", count: inventorySummary.totalProducts },
    {
      value: "in-stock",
      label: "In stock",
      count: inventorySummary.healthyProducts.length,
    },
    {
      value: "low-stock",
      label: "Low stock",
      count: inventorySummary.lowStockProducts.length,
    },
    {
      value: "out-of-stock",
      label: "Out of stock",
      count: inventorySummary.outOfStockProducts.length,
    },
  ];

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
                  Inventory
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quickly spot what is healthy, what needs restocking, and what is
            already out.
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
            onClick={() => void loadInventory()}
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
              Total products
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Layers3 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">
              {inventorySummary.totalProducts}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Product SKUs currently tracked in the catalog.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total stock units
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-500/10 text-sky-600">
              <PackageSearch className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">
              {inventorySummary.totalUnits}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              All stock units across the active catalog.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low stock items
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600">
              <AlertTriangle className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">
              {inventorySummary.lowStockProducts.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Items with stock between 1 and {LOW_STOCK_THRESHOLD}.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-background">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Out of stock
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-rose-500/10 text-rose-600">
              <CircleAlert className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-foreground">
              {inventorySummary.outOfStockProducts.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Products that need immediate restocking.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border-border/60 shadow-sm bg-background overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/20">
            <CardTitle className="text-lg font-semibold text-foreground">
              Out-of-stock items
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These products are unavailable right now and should be restocked
              first.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {inventorySummary.outOfStockProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center text-muted-foreground">
                  <PackageOpen className="mb-3 size-10 text-emerald-500/70" />
                  <p className="font-medium text-foreground">
                    No out-of-stock items
                  </p>
                  <p className="mt-1 text-sm">
                    Every product currently has inventory available.
                  </p>
                </div>
              ) : (
                inventorySummary.outOfStockProducts
                  .slice()
                  .sort((left, right) => left.name.localeCompare(right.name))
                  .map((product) => {
                    const state = getStockState(product.stock);
                    const Icon = state.icon;

                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between gap-4 px-6 py-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
                            <Icon className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {product.name}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">
                              SKU {product.sku}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <Badge className={state.badgeClass}>
                            {state.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-background overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/20">
            <CardTitle className="text-lg font-semibold text-foreground">
              Low-stock items
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These items are still available, but the buffer is small.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {inventorySummary.lowStockProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center text-muted-foreground">
                  <AlertTriangle className="mb-3 size-10 text-amber-500/80" />
                  <p className="font-medium text-foreground">
                    No low-stock alerts
                  </p>
                  <p className="mt-1 text-sm">
                    No product has fallen below the threshold of{" "}
                    {LOW_STOCK_THRESHOLD}.
                  </p>
                </div>
              ) : (
                inventorySummary.lowStockProducts
                  .slice()
                  .sort(
                    (left, right) =>
                      left.stock - right.stock ||
                      left.name.localeCompare(right.name),
                  )
                  .map((product) => {
                    const state = getStockState(product.stock);
                    const Icon = state.icon;

                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between gap-4 px-6 py-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300">
                            <Icon className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {product.name}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">
                              SKU {product.sku}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <Badge className={state.badgeClass}>
                            {state.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm bg-background overflow-hidden">
        <CardHeader className="border-b border-border/60 bg-muted/20 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Inventory breakdown
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Search all products and inspect stock status at a glance.
              </p>
            </div>

            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product name, SKU, or description"
                className="pl-9 shadow-sm bg-background"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isActive = filter === option.value;

              return (
                <Button
                  key={option.value}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(option.value)}
                  className="gap-2"
                >
                  <span>{option.label}</span>
                  <Badge
                    className={
                      isActive
                        ? "bg-background/15 text-inherit hover:bg-background/15 border-0"
                        : "bg-muted text-muted-foreground hover:bg-muted border-0"
                    }
                  >
                    {option.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Loading inventory...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4 text-muted-foreground">
              <PackageSearch className="mb-4 size-10 text-primary/70" />
              <p className="font-medium text-foreground">
                No matching items found
              </p>
              <p className="mt-1 text-sm max-w-sm">
                Try a different search term or switch to another inventory
                filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-border/60">
                    <TableHead className="h-11 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Product
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      SKU
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Stock
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Stock level
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Availability
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const state = getStockState(product.stock);
                    const Icon = state.icon;
                    const progressValue = Math.max(
                      0,
                      Math.min(
                        100,
                        Math.round((product.stock / maxStock) * 100),
                      ),
                    );

                    return (
                      <TableRow
                        key={product.id}
                        className={`group transition-colors ${state.rowClass}`}
                      >
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
                              <Icon className="size-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground">
                                {product.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground max-w-[260px]">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-5">
                          <span className="rounded-md border border-border/40 bg-muted/60 px-2 py-1 font-mono text-[11px] font-medium text-muted-foreground">
                            {product.sku}
                          </span>
                        </TableCell>
                        <TableCell className="px-5">
                          <span className="text-sm font-semibold text-foreground">
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell className="px-5">
                          <div className="space-y-2">
                            <Progress
                              value={progressValue}
                              className="h-2 w-[180px]"
                            />
                            <p className="text-xs text-muted-foreground">
                              {progressValue}% of the strongest stocked item
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="px-5">
                          <Badge className={state.badgeClass}>
                            {state.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
