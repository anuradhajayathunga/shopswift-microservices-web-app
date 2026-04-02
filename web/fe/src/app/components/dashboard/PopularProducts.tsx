"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useMemo, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Icon } from "@iconify/react";
import SimpleBar from "simplebar-react";
import type { VariantProps } from "class-variance-authority";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Progress, progressIndicatorVariants } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import product1 from "../../../../public/images/products/s1.jpg";
import product2 from "../../../../public/images/products/s2.jpg";
import product3 from "../../../../public/images/products/s3.jpg";
import product4 from "../../../../public/images/products/s4.jpg";
import product5 from "../../../../public/images/products/s5.jpg";
import { productAPI, type Product } from "@/lib/products";

const MAX_PRODUCTS = 4;

const fallbackImages = [product1, product2, product3, product4, product5];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const PopularProducts = () => {
  type BadgeVariant =
    | "lightSecondary"
    | "lightSuccess"
    | "destructive"
    | "lightError"
    | "default"
    | "outline"
    | "warning"
    | null
    | undefined;
  type ProgressVariant = VariantProps<
    typeof progressIndicatorVariants
  >["variant"];

  type ProductItem = {
    img: StaticImageData | string;
    name: string;
    payment: string;
    paymentstatus: string;
    process: number;
    processcolor: string;
    statuscolor: string;
    statustext: string;
    variant?: BadgeVariant;
    progressVariant?: ProgressVariant;
  };

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const deriveProgress = (stock: number, offerPercentage?: number | null) => {
    if (typeof offerPercentage === "number") {
      return Math.max(0, Math.min(100, Math.round(offerPercentage)));
    }

    return Math.max(10, Math.min(100, stock));
  };

  const mapProductToItem = (product: Product, index: number): ProductItem => {
    const isActive = product.is_active;
    const hasOffer = typeof product.offer_percentage === "number";
    const progress = deriveProgress(product.stock, product.offer_percentage);
    const fallbackImage = fallbackImages[index % fallbackImages.length];
    const imageSrc =
      typeof product.image_url === "string" && product.image_url.startsWith("/")
        ? product.image_url
        : fallbackImage;

    return {
      img: imageSrc,
      name: product.name,
      payment: formatCurrency(product.price),
      paymentstatus: `Stock: ${product.stock}`,
      process: progress,
      processcolor: isActive ? "bg-green-500" : "bg-red-500",
      statuscolor: isActive ? "success" : "destructive",
      statustext: isActive ? (hasOffer ? "On sale" : "Active") : "Inactive",
      variant: isActive ? "lightSuccess" : "lightError",
      progressVariant: isActive ? (hasOffer ? "warning" : "success") : "error",
    };
  };

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await productAPI.list();

        if (!isMounted) {
          return;
        }

        setProducts(data.map(mapProductToItem).slice(0, MAX_PRODUCTS));
      } catch {
        if (!isMounted) {
          return;
        }

        setProducts([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const productRows = useMemo(
    () => products.slice(0, MAX_PRODUCTS),
    [products],
  );

  const tableActionData = [
    { icon: "solar:add-circle-outline", listtitle: "Add" },
    { icon: "solar:pen-new-square-broken", listtitle: "Edit" },
    { icon: "solar:trash-bin-minimalistic-outline", listtitle: "Delete" },
  ];

  return (
    <div className="rounded-3xl dark:shadow-dark-md shadow-md bg-background py-6 px-0 relative w-full break-words">
      <div className="px-6">
        <h5 className="card-title">Popular Products</h5>
        <p className="card-subtitle">
          {isLoading
            ? "Loading live products"
            : `Total ${products.length} Products`}
        </p>
      </div>

      <SimpleBar className="max-h-[450px]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-6">Products</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {productRows.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap ps-6">
                    <div className="flex gap-3 items-center">
                      <Image
                        src={item.img}
                        alt="icon"
                        className="h-[60px] w-[60px] rounded-md"
                        height={60}
                        width={60}
                      />
                      <div className="truncate line-clamp-2 max-w-56">
                        <h6 className="text-sm">{item.name}</h6>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <h5 className="text-base text-wrap">
                      {item.payment}
                      <span className="text-dark dark:text-darklink opacity-70">
                        <span className="mx-1">/</span>
                        {item.paymentstatus}
                      </span>
                    </h5>
                    <div className="text-sm font-medium text-dark dark:text-darklink opacity-70 mb-2 text-wrap">
                      {item.paymentstatus}
                    </div>
                    <div className="me-5">
                      <Progress
                        variant={item.progressVariant}
                        value={item.process}
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={item?.variant as BadgeProps["variant"]}>
                      {item.statustext}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                          <HiOutlineDotsVertical size={22} />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {tableActionData.map((items, index) => (
                          <DropdownMenuItem key={index} className="flex gap-3">
                            <Icon icon={items.icon} height={18} />
                            <span>{items.listtitle}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SimpleBar>
    </div>
  );
};

export default PopularProducts;
