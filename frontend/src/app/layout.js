"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ListChecks, ClipboardPlus, Scissors, Trophy } from "lucide-react";
import { clsx as cn } from "clsx";

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

const menuItems = [
  { name: "Overview", href: "/overview", icon: <Image src="/chart.svg" alt="chart" width={20} height={20} className="w-5 h-5"/> },
  { name: "Product List", href: "/productList", icon: <ListChecks className="w-5 h-5"/>},
  { name: "Add Product", href: "/addProduct", icon: <ClipboardPlus className="w-5 h-5"/> },
  { name: "Update Product", href: "/updateProduct", icon: <Scissors className="w-5 h-5"/> },
];

const workplaceItems = [
  { name: "About Us", href: "/dashboard/settings", icon: <Trophy className="w-5 h-5" /> },
  { name: "Log out", href: "/dashboard/se", icon: <Image src="/logout.svg" alt="logout" width={20} height={20} className="w-5 h-5" /> },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body className={interFont.className}>
        <div className="bg-[#D9D9D9] min-h-screen flex">
          <aside className="flex flex-col h-screen w-64 bg-white text-gray-900 p-5 fixed shadow-md">
            <div className="flex justify-center mb-5">
              <Image src="/logo.svg" alt="GST logo" width={96} height={80} className="h-20 w-24"/>
            </div>
            <nav className="space-y-2 w-full">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-2 rounded-lg transition",
                    pathname === item.href ? "bg-gray-300" : "hover:bg-gray-200"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto w-full pt-4 border-t border-gray-200">
              <nav className="space-y-2">
                {workplaceItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-2 rounded-lg transition",
                      pathname === item.href ? "bg-purple-100 text-purple-700 font-semibold" : "hover:bg-gray-100"
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
          <main className="ml-64 p-8 flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}