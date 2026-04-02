"use client";
import Image from "next/image";

import user1 from "../../../../public/images/profile/user-6.jpg";
import user2 from "../../../../public/images/profile/user-2.jpg";
import user3 from "../../../../public/images/profile/user-3.jpg";
import img1 from "../../../../public/images/blog/blog-img1.jpg";
import img2 from "../../../../public/images/blog/blog-img2.jpg";
import img3 from "../../../../public/images/blog/blog-img3.jpg";
import { TbPoint }   from "react-icons/tb";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const BlogCardsData = [
  {
    avatar: user1,
    coveravatar: img1,
    read: "2 min Read",
    title: "As yen tumbles, gadget-loving Japan goes for secondhand iPhones",
    category: "Social",
    name: "Georgeanna Ramero",
    view: "9,125",
    comments: "3",
    time: "Mon, Dec 19",
    url:''
  },
  {
    avatar: user2,
    coveravatar: img2,
    read: "2 min Read",
    title:
      "Intel loses bid to revive antitrust case against patent foe Fortress",
    category: "Gadget",
    name: "Georgeanna Ramero",
    view: "4,150",
    comments: "38",
    time: "Sun, Dec 18",
    url:''
  },
  {
    avatar: user3,
    coveravatar: img3,
    read: "2 min Read",
    title: "COVID outbreak deepens as more lockdowns loom in China",
    category: "Health",
    name: "Georgeanna Ramero",
    view: "9,480",
    comments: "12",
    time: "Sat, Dec 17",
    url:''
  },
];

const BlogCards = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-30">
        {BlogCardsData.map((item, i) => (
          <div className="lg:col-span-4 col-span-12" key={i}>
            <Link href={item.url} className="group">
            <div className="rounded-3xl dark:shadow-dark-md shadow-md bg-background p-0 relative w-full break-words overflow-hidden">
                <div className="relative">
                  <Image src={item.coveravatar} alt="materialm" />
                  <Badge className="absolute bottom-4 right-4 bg-white text-dark">
                    {item.read}
                  </Badge>
                </div>

                <div className="px-6 pb-6">
                  <Image
                    src={item.avatar}
                    className="h-10 w-10 rounded-full -mt-7 relative z-1"
                    alt="user"
                  />
                  <Badge variant={"gray"} className="mt-6">
                    {item.category}
                  </Badge>
                  <h5 className="text-lg my-6 group-hover:text-primary line-clamp-2">{item.title}</h5>
                  <div className="flex">
                    <div className="flex gap-2 me-6 items-center">
                    <Icon icon="solar:eye-outline" height="18" className="text-dark dark:text-white" />
                      <span className="text-sm text-darklink">{item.view}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                    <Icon icon="solar:chat-line-outline" height="18" className="text-dark dark:text-white" />
                      <span className="text-sm text-darklink">{item.view}</span>
                    </div>
                    <div className="flex gap-1 items-center ms-auto">
                      <TbPoint
                        size={15}
                        className="text-dark"
                      />{" "}
                      <span className="text-sm text-darklink">{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlogCards;
// "use client";
// import Image, { type StaticImageData } from "next/image";
// import { useEffect, useState } from "react";

// import user1 from "../../../../public/images/profile/user-6.jpg";
// import user2 from "../../../../public/images/profile/user-2.jpg";
// import user3 from "../../../../public/images/profile/user-3.jpg";
// import img1 from "../../../../public/images/blog/blog-img1.jpg";
// import img2 from "../../../../public/images/blog/blog-img2.jpg";
// import img3 from "../../../../public/images/blog/blog-img3.jpg";
// import { TbPoint } from "react-icons/tb";

// import { Icon } from "@iconify/react";
// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { publicProductAPI, type PublicProduct } from "@/lib/public-products";

// const fallbackAvatars = [user1, user2, user3];
// const fallbackImages = [img1, img2, img3];

// const formatCurrency = (value: number) => {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: 0,
//   }).format(value);
// };

// const getImageSource = (
//   imageUrl: string | null | undefined,
//   fallbackIndex: number,
// ) => {
//   if (typeof imageUrl === "string" && imageUrl.startsWith("/")) {
//     return imageUrl;
//   }

//   return fallbackImages[fallbackIndex % fallbackImages.length];
// };

// const getAvatarSource = (
//   imageUrl: string | null | undefined,
//   fallbackIndex: number,
// ) => {
//   if (typeof imageUrl === "string" && imageUrl.startsWith("/")) {
//     return imageUrl;
//   }

//   return fallbackAvatars[fallbackIndex % fallbackAvatars.length];
// };

// type BlogCardItem = {
//   avatar: StaticImageData | string;
//   coveravatar: StaticImageData | string;
//   read: string;
//   title: string;
//   category: string;
//   name: string;
//   view: string;
//   comments: string;
//   time: string;
//   url: string;
// };

// const BlogCards = () => {
//   const [cards, setCards] = useState<BlogCardItem[]>([]);

//   useEffect(() => {
//     let isMounted = true;

//     const loadProducts = async () => {
//       try {
//         const products = await publicProductAPI.list();

//         if (!isMounted) {
//           return;
//         }

//         const mappedCards = products
//           .slice(0, 3)
//           .map((product: PublicProduct, index: number) => ({
//             avatar: getAvatarSource(product.image_url, index),
//             coveravatar: getImageSource(product.image_url, index),
//             read: product.offer_percentage
//               ? `${Math.round(product.offer_percentage)}% Off`
//               : `${product.stock} in stock`,
//             title: product.name,
//             category:
//               product.tag || (product.is_active ? "Active" : "Inactive"),
//             name: product.sku,
//             view: formatCurrency(product.price),
//             comments: String(product.stock),
//             time: product.tag || `SKU ${product.sku}`,
//             url: `/store/product/${product.id}`,
//           }));

//         setCards(mappedCards);
//       } catch {
//         if (!isMounted) {
//           return;
//         }

//         setCards([]);
//       }
//     };

//     void loadProducts();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return (
//     <>
//       <div className="grid grid-cols-12 gap-30">
//         {cards.map((item, i) => (
//           <div className="lg:col-span-4 col-span-12" key={i}>
//             <Link href={item.url} className="group">
//               <div className="rounded-3xl dark:shadow-dark-md shadow-md bg-background p-0 relative w-full break-words overflow-hidden">
//                 <div className="relative">
//                   <Image src={item.coveravatar} alt="materialm" />
//                   <Badge className="absolute bottom-4 right-4 bg-white text-dark">
//                     {item.read}
//                   </Badge>
//                 </div>

//                 <div className="px-6 pb-6">
//                   <Image
//                     src={item.avatar}
//                     className="h-10 w-10 rounded-full -mt-7 relative z-1"
//                     alt="user"
//                   />
//                   <Badge variant={"gray"} className="mt-6">
//                     {item.category}
//                   </Badge>
//                   <h5 className="text-lg my-6 group-hover:text-primary line-clamp-2">
//                     {item.title}
//                   </h5>
//                   <div className="flex">
//                     <div className="flex gap-2 me-6 items-center">
//                       <Icon
//                         icon="solar:eye-outline"
//                         height="18"
//                         className="text-dark dark:text-white"
//                       />
//                       <span className="text-sm text-darklink">{item.view}</span>
//                     </div>
//                     <div className="flex gap-2 items-center">
//                       <Icon
//                         icon="solar:chat-line-outline"
//                         height="18"
//                         className="text-dark dark:text-white"
//                       />
//                       <span className="text-sm text-darklink">
//                         {item.comments}
//                       </span>
//                     </div>
//                     <div className="flex gap-1 items-center ms-auto">
//                       <TbPoint size={15} className="text-dark" />{" "}
//                       <span className="text-sm text-darklink">{item.time}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default BlogCards;
