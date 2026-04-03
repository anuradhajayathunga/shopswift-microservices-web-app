"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Pencil,
  Plus,
  Trash2,
  PackageSearch,
  Search,
  ListFilter,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { productAPI, type Product, type ProductPayload } from "@/lib/products";

// --- Types & Validation ---
type ProductVariantFormState = {
  color: string;
  size: string;
  images: string;
};

type ProductFormState = {
  name: string;
  description: string;
  sku: string;
  price: string;
  stock: string;
  image_url: string;
  tag: string;
  offer_percentage: string;
  sizes: string;
  variants: ProductVariantFormState[];
};

const emptyVariant = (): ProductVariantFormState => ({
  color: "",
  size: "",
  images: "",
});

const initialFormState: ProductFormState = {
  name: "",
  description: "",
  sku: "",
  price: "",
  stock: "",
  image_url: "",
  tag: "",
  offer_percentage: "",
  sizes: "M",
  variants: [emptyVariant()],
};

const parseDelimitedList = (value: string) =>
  value
    .split(/[,|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

const PRODUCT_SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const serializeVariant = (variant: ProductVariantFormState) => ({
  color: variant.color.trim(),
  size: variant.size.trim(),
  images: parseDelimitedList(variant.images).slice(0, 3),
});

const getActiveVariants = (form: ProductFormState) =>
  form.variants
    .map(serializeVariant)
    .filter(
      (variant) =>
        variant.color.length > 0 ||
        variant.size.length > 0 ||
        variant.images.length > 0,
    );

const toPayload = (form: ProductFormState): ProductPayload => ({
  name: form.name.trim(),
  description: form.description.trim(),
  sku: form.sku.trim(),
  price: Number(form.price),
  stock: Number(form.stock),
  image_url: form.image_url.trim() || undefined,
  tag: form.tag.trim() || undefined,
  offer_percentage:
    form.offer_percentage.trim() === ""
      ? undefined
      : Number(form.offer_percentage),
  sizes: (() => {
    const manualSizes = parseDelimitedList(form.sizes);
    if (manualSizes.length > 0) {
      return manualSizes;
    }

    const variantSizes = Array.from(
      new Set(getActiveVariants(form).map((variant) => variant.size)),
    );

    return variantSizes.length > 0 ? variantSizes : undefined;
  })(),
  variants: (() => {
    const activeVariants = getActiveVariants(form);
    return activeVariants.length > 0 ? activeVariants : undefined;
  })(),
});

const validateForm = (form: ProductFormState) => {
  if (!form.name.trim()) return "Product name is required";
  if (!form.description.trim()) return "Description is required";
  if (!form.sku.trim()) return "SKU is required";

  const price = Number(form.price);
  if (Number.isNaN(price) || price <= 0) return "Price must be greater than 0";

  const stock = Number(form.stock);
  if (!Number.isInteger(stock) || stock < 0)
    return "Stock must be 0 or greater";

  if (form.offer_percentage.trim() !== "") {
    const offer = Number(form.offer_percentage);
    if (Number.isNaN(offer) || offer < 0 || offer > 100) {
      return "Offer percentage must be between 0 and 100";
    }
  }

  const activeVariants = getActiveVariants(form);

  const variantKeys = new Set<string>();
  for (const variant of activeVariants) {
    if (!variant.color) return "Variant color is required";
    if (!variant.size) return "Variant size is required";
    if (variant.images.length === 0) {
      return `Add at least 1 image for ${variant.color} / ${variant.size}`;
    }
    if (variant.images.length > 3) {
      return `Maximum 3 images are allowed for ${variant.color} / ${variant.size}`;
    }

    const key = `${variant.color.toLowerCase()}::${variant.size.toLowerCase()}`;
    if (variantKeys.has(key)) {
      return "Duplicate color and size combination is not allowed";
    }
    variantKeys.add(key);
  }

  const sizes = parseDelimitedList(form.sizes);
  if (activeVariants.length > 0 && sizes.length > 0) {
    const availableSizes = new Set(sizes.map((size) => size.toLowerCase()));
    for (const variant of activeVariants) {
      if (!availableSizes.has(variant.size.toLowerCase())) {
        return `Variant size ${variant.size} must exist in the product sizes list`;
      }
    }
  }

  return null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormState>(initialFormState);

  const selectedSizes = useMemo(
    () => parseDelimitedList(form.sizes),
    [form.sizes],
  );

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Action States
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null,
  );
  const [togglingProductId, setTogglingProductId] = useState<number | null>(
    null,
  );

  const isEditing = useMemo(
    () => editingProductId !== null,
    [editingProductId],
  );

  const loadProducts = useCallback(async () => {
    try {
      const data = await productAPI.list();
      setProducts(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load products",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const resetForm = () => {
    setForm(initialFormState);
    setEditingProductId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingProductId(null);
    setForm(initialFormState);
    setShowForm(true);
  };

  const handleChange =
    (key: keyof ProductFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: String(product.price),
      stock: String(product.stock),
      image_url: product.image_url ?? "",
      tag: product.tag ?? "",
      offer_percentage:
        product.offer_percentage === null ||
        product.offer_percentage === undefined
          ? ""
          : String(product.offer_percentage),
      sizes: product.sizes?.join(", ") ?? "",
      variants:
        product.variants && product.variants.length > 0
          ? product.variants.map((variant) => ({
              color: variant.color,
              size: variant.size,
              images: (variant.images ?? []).join(", "),
            }))
          : [emptyVariant()],
    });
    setShowForm(true);
  };

  const addVariantRow = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, emptyVariant()],
    }));
  };

  const removeVariantRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants:
        prev.variants.length > 1
          ? prev.variants.filter((_, variantIndex) => variantIndex !== index)
          : [emptyVariant()],
    }));
  };

  const handleVariantChange =
    (index: number, key: keyof ProductVariantFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        variants: prev.variants.map((variant, variantIndex) =>
          variantIndex === index
            ? { ...variant, [key]: event.target.value }
            : variant,
        ),
      }));
    };

  const handleSizeToggle = (size: string, checked: boolean) => {
    setForm((prev) => {
      const currentSizes = parseDelimitedList(prev.sizes);

      const withoutToggled = currentSizes.filter(
        (currentSize) => currentSize.toLowerCase() !== size.toLowerCase(),
      );

      const nextSizes = checked ? [...withoutToggled, size] : withoutToggled;

      const uniqueOrderedSizes = Array.from(
        new Set(nextSizes.map((item) => item.trim()).filter(Boolean)),
      );

      return {
        ...prev,
        sizes: uniqueOrderedSizes.join(", "),
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = toPayload(form);
      if (editingProductId) {
        await productAPI.update(editingProductId, payload);
        toast.success("Product updated successfully");
      } else {
        await productAPI.create(payload);
        toast.success("Product created successfully");
      }
      resetForm();
      await loadProducts();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`))
      return;

    setDeletingProductId(product.id);
    try {
      await productAPI.remove(product.id);
      toast.success("Product deleted successfully");
      await loadProducts();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete product",
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleToggleActive = async (product: Product, isActive: boolean) => {
    if (product.is_active === isActive) {
      return;
    }

    setTogglingProductId(product.id);
    try {
      await productAPI.update(product.id, { is_active: isActive });
      toast.success(
        isActive
          ? "Product activated successfully"
          : "Product deactivated successfully",
      );
      await loadProducts();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update product status",
      );
    } finally {
      setTogglingProductId(null);
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0)
      return (
        <Badge
          variant="destructive"
          className="bg-rose-100 text-rose-800 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900 shadow-none border-0 font-medium"
        >
          Out of Stock
        </Badge>
      );
    if (stock <= 10)
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900 shadow-none border-0 font-medium"
        >
          Low Stock ({stock})
        </Badge>
      );
    return (
      <Badge
        variant="secondary"
        className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900 shadow-none border-0 font-medium"
      >
        In Stock ({stock})
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
                  Products
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your inventory, pricing, and catalog details.
          </p>
        </div>
        <Button onClick={openCreateForm} className="gap-2 shadow-sm">
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      {/* Product Form Modal */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) resetForm();
          else setShowForm(true);
        }}
      >
        <DialogContent className="sm:max-w-[700px] p-0 border-border/60 shadow-xl overflow-hidden">
          <div className="px-6 pt-6 pb-4 bg-muted/30 dark:bg-muted/5 border-b border-border/60">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {isEditing ? "Edit Product" : "New Product"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the details for this product below."
                  : "Fill in the required information to list a new item."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto max-h-[70vh] bg-gray-50/50 dark:bg-transparent"
          >
            <div className="px-6 space-y-5 pb-6">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase text-muted-foreground"
                >
                  Product Name
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="e.g. Organic Rolled Oats"
                  disabled={isSubmitting}
                  className="shadow-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="sku"
                    className="text-xs font-semibold uppercase text-muted-foreground"
                  >
                    SKU / ID
                  </Label>
                  <Input
                    id="sku"
                    value={form.sku}
                    onChange={handleChange("sku")}
                    placeholder="ORG-OTS-001"
                    disabled={isSubmitting}
                    className="shadow-none font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="stock"
                    className="text-xs font-semibold uppercase text-muted-foreground"
                  >
                    Stock Qty
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    step="1"
                    min="0"
                    value={form.stock}
                    onChange={handleChange("stock")}
                    placeholder="0"
                    disabled={isSubmitting}
                    className="shadow-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="price"
                  className="text-xs font-semibold uppercase text-muted-foreground"
                >
                  Price (LKR)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.price}
                  onChange={handleChange("price")}
                  placeholder="0.0"
                  disabled={isSubmitting}
                  className="shadow-none max-w-[50%]"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="description"
                  className="text-xs font-semibold uppercase text-muted-foreground"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={handleChange("description")}
                  placeholder="Describe the product features and benefits..."
                  disabled={isSubmitting}
                  className="min-h-[100px] shadow-none resize-none bg-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="tag"
                    className="text-xs font-semibold uppercase text-muted-foreground"
                  >
                    Tag (Optional)
                  </Label>
                  <Input
                    id="tag"
                    value={form.tag}
                    onChange={handleChange("tag")}
                    placeholder="e.g. NEW, HOT, SALE"
                    disabled={isSubmitting}
                    className="shadow-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="offer_percentage"
                    className="text-xs font-semibold uppercase text-muted-foreground"
                  >
                    Offer % (Optional)
                  </Label>
                  <Input
                    id="offer_percentage"
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={form.offer_percentage}
                    onChange={handleChange("offer_percentage")}
                    placeholder="e.g. 20"
                    disabled={isSubmitting}
                    className="shadow-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="image_url"
                  className="text-xs font-semibold uppercase text-muted-foreground"
                >
                  Image URL (Optional)
                </Label>
                <Input
                  id="image_url"
                  value={form.image_url}
                  onChange={handleChange("image_url")}
                  placeholder="https://example.com/product.jpg"
                  disabled={isSubmitting}
                  className="shadow-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                  Sizes (Optional)
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg border border-border/60 bg-background p-3">
                  {PRODUCT_SIZE_OPTIONS.map((size) => {
                    const isChecked = selectedSizes.some(
                      (selectedSize) =>
                        selectedSize.toLowerCase() === size.toLowerCase(),
                    );

                    return (
                      <label
                        key={size}
                        className="flex items-center gap-2 rounded-md border border-transparent px-2.5 py-2 hover:bg-muted/60 cursor-pointer"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleSizeToggle(size, checked === true)
                          }
                          disabled={isSubmitting}
                        />
                        <span className="text-sm font-medium">{size}</span>
                      </label>
                    );
                  })}
                </div>
                <Input
                  id="sizes"
                  value={form.sizes}
                  onChange={handleChange("sizes")}
                  placeholder="Need custom sizes? Add comma separated values"
                  disabled={isSubmitting}
                  className="shadow-none"
                />
              </div>

              <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 dark:bg-muted/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">Variants</h4>
                    <p className="text-xs text-muted-foreground">
                      Add colors, sizes, and up to 3 images for each variant.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariantRow}
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    <Plus className="size-4" />
                    Add Variant
                  </Button>
                </div>

                <div className="space-y-3">
                  {form.variants.map((variant, index) => (
                    <div key={index} className="p-3 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Variant {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariantRow(index)}
                          disabled={isSubmitting}
                          className="h-8 px-2 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4 mr-1" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold uppercase text-muted-foreground">
                            Color
                          </Label>
                          <Input
                            value={variant.color}
                            onChange={handleVariantChange(index, "color")}
                            placeholder="Black"
                            disabled={isSubmitting}
                            className="shadow-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold uppercase text-muted-foreground">
                            Size
                          </Label>
                          <Input
                            value={variant.size}
                            onChange={handleVariantChange(index, "size")}
                            placeholder="M"
                            disabled={isSubmitting}
                            className="shadow-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground">
                          Images (up to 3, comma separated)
                        </Label>
                        <Input
                          value={variant.images}
                          onChange={handleVariantChange(index, "images")}
                          placeholder="/images/black-m-1.jpg, /images/black-m-2.jpg"
                          disabled={isSubmitting}
                          className="shadow-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="bg-background shadow-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[110px] shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <Card className="border-border/60 shadow-sm dark:shadow-dark-md bg-background overflow-hidden rounded-2xl">
        {/* Table Toolbar */}
        <div className="px-5 py-4 border-b border-border/60 bg-muted/5 rounded-2xl flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU..."
              className="pl-9 h-9 bg-background shadow-sm border-border/60 transition-colors focus-visible:ring-1"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 bg-background shadow-sm text-muted-foreground border-border/60"
          >
            <ListFilter className="size-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary/60 mb-4" />
              <p className="text-sm">Loading catalog data...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <PackageSearch className="size-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No products found
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                You haven&apos;t added any products to your catalog yet. Get
                started by creating your first product.
              </p>
              <Button
                onClick={openCreateForm}
                variant="outline"
                className="shadow-sm border-border/60"
              >
                <Plus className="size-4 mr-2" />
                Add First Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-border/60">
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Product
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      SKU
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Promo
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                      Price
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Inventory
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="h-11 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right w-[100px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="group hover:bg-muted/40 transition-colors border-b-border/50"
                    >
                      <TableCell className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.image_url ||
                              "/images/products/product-placeholder.jpg"
                            }
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover border border-border/60"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {product.name}
                            </span>
                            <span
                              className="text-xs text-muted-foreground truncate max-w-[240px] mt-0.5"
                              title={product.description}
                            >
                              {product.description}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5">
                        <span className="font-mono text-[11px] font-medium text-muted-foreground bg-muted/60 dark:bg-muted/30 px-2 py-1 rounded-md border border-border/40">
                          {product.sku}
                        </span>
                      </TableCell>
                      <TableCell className="px-5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {product.tag ? (
                            <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100 border-0 shadow-none font-medium dark:bg-sky-950/50 dark:text-sky-300">
                              {product.tag}
                            </Badge>
                          ) : null}
                          {product.offer_percentage &&
                          product.offer_percentage > 0 ? (
                            <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-0 shadow-none font-medium dark:bg-rose-950/50 dark:text-rose-300">
                              -{Math.round(product.offer_percentage)}%
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 text-right font-medium text-foreground">
                        {new Intl.NumberFormat("en-LK", {
                          style: "currency",
                          currency: "LKR",
                        }).format(product.price)}
                      </TableCell>
                      <TableCell className="px-5">
                        <div className="flex flex-wrap items-center gap-4">
                          {getStockBadge(product.stock)}
                        </div>
                      </TableCell>
                      <TableCell className="px-5">
                        <div className="inline-flex items-center gap-2 ">
                          <Switch
                            checked={product.is_active}
                            onCheckedChange={(checked) =>
                              void handleToggleActive(product, checked)
                            }
                            disabled={
                              isSubmitting ||
                              deletingProductId === product.id ||
                              togglingProductId === product.id
                            }
                            aria-label={`Toggle ${product.name} active state`}
                          />
                          <span className="text-xs font-medium text-muted-foreground min-w-[58px]">
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                          {togglingProductId === product.id && (
                            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-8 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => handleEdit(product)}
                            disabled={
                              isSubmitting ||
                              deletingProductId === product.id ||
                              togglingProductId === product.id
                            }
                            title="Edit Product"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={() => handleDelete(product)}
                            disabled={
                              isSubmitting ||
                              deletingProductId === product.id ||
                              togglingProductId === product.id
                            }
                            title="Delete Product"
                          >
                            {deletingProductId === product.id ? (
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
