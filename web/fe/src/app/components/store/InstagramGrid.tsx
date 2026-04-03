"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TbBrandFacebook, TbBrandInstagram } from "react-icons/tb";

// Mock data representing the grid items
const instagramPosts = [
  {
    id: 1,
    type: "big", // The large 2x2 promotional image
    src: "https://instagram.fcmb3-2.fna.fbcdn.net/v/t51.82787-15/656696980_17993149757939417_7478967309425468533_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=Mzg2MjAzOTM5ODYxNTY2NTc1Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMS5zZHIuQzIifQ%3D%3D&_nc_ohc=y1ToFBybh64Q7kNvwHZdXWy&_nc_oc=AdqsbzRj43TB1LoODom-_9tWdY91yes8wQEWUGfozE2LnqeMJHFXuTkQUUXYCaoBzDRrVq0PrjQB_-3gzVu7B9C2&_nc_ad=z-m&_nc_cid=1017&_nc_zt=23&_nc_ht=instagram.fcmb3-2.fna&_nc_gid=N6KMMM64gF3EQq1fTb4Aww&_nc_ss=7a32e&oh=00_Af3mEyFuOI2UBJ9WOpW6yc37-BVV4jHklYsm25cyyR2oZg&oe=69D57CB0",
    alt: "Avurudu Promo - Up to 40% Off",
  },
  {
    id: 2,
    src: "https://instagram.fcmb3-2.fna.fbcdn.net/v/t51.82787-15/574231047_17977143650939417_124945855445473172_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzc1NzY5NTcxOTU2MzI2MTA5OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTc5NS5zZHIuQzIifQ%3D%3D&_nc_ohc=6TITzNgtctwQ7kNvwEnjCkJ&_nc_oc=Adq45Aiv_ePZYvR7xBBeOBH1yKri91dtqtg9ESUL_EC1PTTTRsVIa4mhxn_EtVMF4f6PrX-HuHL9aIzTlURDuzof&_nc_ad=z-m&_nc_cid=1017&_nc_zt=23&_nc_ht=instagram.fcmb3-2.fna&_nc_gid=ysqj4n40pndowegZufDuKw&_nc_ss=7a32e&oh=00_Af0Im691wz6WMEEp6wIGYnsJiCtYoPxxR2Bg9_HON9OxlQ&oe=69D57240",
    alt: "Black Polo Fit",
  },
  {
    id: 3,
    src: "https://instagram.fcmb3-2.fna.fbcdn.net/v/t51.82787-15/572950808_17976535946939417_8349183765610419999_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzc1MzM4NTYwNzQ0MDc2ODIyNA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTc5NS5zZHIuQzIifQ%3D%3D&_nc_ohc=6E80163Z5vQQ7kNvwFUU0-g&_nc_oc=Adoh9-p_HCyeFIevV1QWNMOXoCrnHY6A7Pa8s1Ge1FFy-tSYwu4CMhXd2kBo3647NLrYGUvafdxxoFGOVGJZKnfh&_nc_ad=z-m&_nc_cid=1017&_nc_zt=23&_nc_ht=instagram.fcmb3-2.fna&_nc_gid=ysqj4n40pndowegZufDuKw&_nc_ss=7a32e&oh=00_Af396AGkOnTCIuxjVR4pKqOThO3u4KTrJlzFSJ6XrdgucA&oe=69D575CA",
    alt: "F1 Refined Cropped Fit",
  },
  {
    id: 4,
    src: "https://instagram.fcmb3-2.fna.fbcdn.net/v/t51.82787-15/657159727_17993523173939417_5708098618543874272_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=109&ig_cache_key=Mzg2NDE5MTIyMjQ2NTI5OTQ5NzE3OTkzNTIzMTY3OTM5NDE3.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjIzMDd4NDA5Ni5zZHIuQzMifQ%3D%3D&_nc_ohc=S6sqts3bRIoQ7kNvwFOCB6-&_nc_oc=AdpcphfzdrMWQmZZj_BfRE4FILmypCdOkMqvOW41sKqNCKtf2KIWpqWRpJa6Uo_9bgPIxZi_7qlEfywYYB3H7caB&_nc_ad=z-m&_nc_cid=1017&_nc_zt=23&_nc_ht=instagram.fcmb3-2.fna&_nc_gid=ScdKVz_hQWYhjrSGVLPqXA&_nc_ss=7a32e&oh=00_Af2RIDDzPkCXOqS2fX2uuWh5Vjrqol44iJiYG69bTyPg4Q&oe=69D56F5E",
    alt: "F2 Signature Cropped Fit",
  },
  {
    id: 5,
    src: "https://instagram.fcmb3-2.fna.fbcdn.net/v/t51.82787-15/657348197_17993149775939417_4936769153665127615_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzg2MjAzOTQzNDU2MDgwNDk1NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5zZHIuQzIifQ%3D%3D&_nc_ohc=Ggi8g-2xcr0Q7kNvwG97Rn5&_nc_oc=AdrNgKZwR-fDdxjtLJQSS6Yio7zdIcVfdTmn4-dD0vtsui1oJl0ymAsYAspwK577qUm9inMMylD6ra06B8C2icA-&_nc_ad=z-m&_nc_cid=1017&_nc_zt=23&_nc_ht=instagram.fcmb3-2.fna&_nc_gid=i24eWFJmO_6dbXub5cbvRA&_nc_ss=7a32e&oh=00_Af23UGAZLw357GMLRGnOw_npjSnIZOkuyRDatm-qLDzthQ&oe=69D58521",
    alt: "F3 Relaxed Cropped Fit",
  },
  {
    id: 6,
    src: "https://scontent.fcmb12-1.fna.fbcdn.net/v/t51.82787-15/658808139_17993895176939417_1717690093068159252_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=13d280&_nc_ohc=uAJUKKGbQwsQ7kNvwG0RE8V&_nc_oc=AdoXCwf48N7HHMy_RIbeKs88nm3fCtmxogxr4eFroTc4Q03iPtrIuj_NUjYJcBXvzKmD1M5kWK1NjLl2imhs3bzc&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=Y3WsqxC4uBakhrxj-H-OXQ&_nc_ss=7a389&oh=00_Af2LKtSfrkj5H-zXB_VP67Jb6F39mDxlHJSj8XTlSpQUbw&oe=69D57A75",
    alt: "Unmeasured Volume Over Form",
  },
  {
    id: 7,
    src: "https://scontent.fcmb12-1.fna.fbcdn.net/v/t51.82787-15/658700305_17993895149939417_7498081396955548632_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_ohc=CBM7WfFKPmAQ7kNvwF6kOqR&_nc_oc=AdpeWdeaVGlrlYk9ekugAMxQsEPIevH4O4ikZGdz8VO1iEQbQ8X2TxGetuEWivj3ryUFXEvXCqNgxS05AJa-OBHm&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=a09fW0pvCZ6vYWszSyoHbQ&_nc_ss=7a389&oh=00_Af1wHGe1r0F8UOX_wb0T1NCefEWn3S7iZ7SlALMvdFPfTQ&oe=69D564FC",
    alt: "Disagree body shape text",
  },
  {
    id: 8,
    src: "https://scontent.fcmb11-3.fna.fbcdn.net/v/t51.82787-15/572657064_17976641567939417_5468006560987980401_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=13d280&_nc_ohc=4u9unwZG1woQ7kNvwEwXJd0&_nc_oc=AdpYIhthokyEYuXF3pYGVj1IyHqo1nQRM-ZJFCErZcytOREm2fhwXaMq83O5O6guBVze6Ju4NZU7oNCKsORLZNLv&_nc_zt=23&_nc_ht=scontent.fcmb11-3.fna&_nc_gid=N0l7pjSxEI0mbr44cyhpLA&_nc_ss=7a389&oh=00_Af0x8j7ERmv-LrE-n3VGEAZbE9sCDzDNyIZxZOX-z--NTA&oe=69D57365",
    alt: "Does body shape matter text",
  },
  {
    id: 9,
    src: "https://scontent.fcmb12-1.fna.fbcdn.net/v/t51.82787-15/566166745_17975910302939417_7547064868904256966_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=13d280&_nc_ohc=1cu1mGK5Y6kQ7kNvwGv_5dC&_nc_oc=AdpB9qTmGa0-_K2NlYYl8LGGy_6Hv64iL-RHCEOTm_smuww6D7S-n76Lzz7eqHgwwT0gjxObOFU-RMgYKWoERhb-&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=39RknqERqZlF3zp4Y8Ml1Q&_nc_ss=7a389&oh=00_Af1IdM66RqTSmLwbyT-A0SegXeSxliBgckzbf3iwZCz1qw&oe=69D5883E",
    alt: "Guy in hype tee on couch",
  },
  {
    id: 10,
    src: "https://scontent.fcmb3-3.fna.fbcdn.net/v/t51.82787-15/564523632_17975910332939417_7905490118766335572_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=13d280&_nc_ohc=ZjRXureuI24Q7kNvwGHwogJ&_nc_oc=Adp6OZJFqOOW85iqCE3yd_1mlx_icQuv0L1Pg1r2WC2RlzDzZjHn88uxirTLqKKr3UlWgs4k3jsERfDHs34FFYFD&_nc_zt=23&_nc_ht=scontent.fcmb3-3.fna&_nc_gid=QfA4uzi6RVjuA2QcEWdagA&_nc_ss=7a389&oh=00_Af12sjoQIlGc6xVCdJM0XHFKIQV2AvsNPfJbOgxAvCkGPA&oe=69D5878E",
    alt: "Guy walking with back graphic",
  },
  {
    id: 11,
    src: "https://scontent.fcmb12-1.fna.fbcdn.net/v/t51.75761-15/500742943_17958891389939417_2787692822281570711_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_ohc=XORFTXZP7XUQ7kNvwHSbOAJ&_nc_oc=AdrzH6M25ViVthtmPEV5Fd00h-2tz5cAQ20iLf7sKfG1_0rIcprMRw_5ZKczorDtJX8F2IgE23NsKYqhIREhSyE7&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=W5GAJTbgt_uijshOQHxQVQ&_nc_ss=7a389&oh=00_Af0-it-4dX1UdBe95tx5Ym7XgPA1tkxf_cXGnJfXxfzMqA&oe=69D57E0C",
    alt: "Guy in brown shirt portrait",
  },
  {
    id: 12,
    src: "https://scontent.fcmb3-2.fna.fbcdn.net/v/t51.82787-15/571000384_17976642221939417_7592572779594800189_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=13d280&_nc_ohc=z2jzlrCppx8Q7kNvwHPl7MO&_nc_oc=AdqDdfpseHByOYatxjyTfPLAZ1OMQ7sDs3cfMPLCZo210aN3Dh2cFxF26vDpEF9bvFRYXHbSBOdbc5TDQZEdycDW&_nc_zt=23&_nc_ht=scontent.fcmb3-2.fna&_nc_gid=AQUfnaJZCHmdd9SmFZ2zIg&_nc_ss=7a389&oh=00_Af2uutD6jyVZrnq7_EJ7w1dw5x1_bBp2QBDnHTkoCsjLww&oe=69D58FC7",
    alt: "Ride Safe back graphic",
  },
];

export function InstagramGrid() {
  return (
    <section className="w-full bg-white py-16 md:py-24 border-t border-gray-200 font-sans">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div className="space-y-2">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
              On The Grid
            </h3>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight uppercase text-gray-900">
              Follow Us
            </h2>
          </div>

          <Link
            href="https://instagram.com/hype_sl_"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 text-sm font-bold tracking-widest text-gray-900 border-b border-gray-900 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors shrink-0 w-fit uppercase"
          >
            @hype_sl_
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* The Bento Grid
          - Mobile: 2 columns (11 items visible to keep it a perfect rectangle)
          - Tablet/Desktop: 5 columns (12 items visible, perfectly fills 3 rows)
        */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1 sm:gap-2">
          {instagramPosts.map((post, index) => (
            <Link
              key={post.id}
              href="https://instagram.com/hype_sl_"
              target="_blank"
              rel="noreferrer"
              className={`group relative overflow-hidden bg-gray-100 block transition-all ${
                post.type === "big"
                  ? "col-span-2 row-span-2 aspect-square md:aspect-auto"
                  : "col-span-1 row-span-1 aspect-square"
              } ${index === 11 ? "hidden md:block" : ""}`} // Hides the 12th item on mobile to prevent grid gaps
            >
              {/* Image */}
              <img
                src={post.src}
                alt={post.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              {/* Minimalist Premium Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                <div className="flex flex-col items-center gap-3 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <TbBrandInstagram className="w-8 h-8" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                    View Post
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
