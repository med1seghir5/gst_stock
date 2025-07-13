"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ListChecks, ClipboardPlus, Scissors, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

const menuItems = [
  {
    name: "Overview",
    href: "/overview",
    icon: <Image src="/chart.svg" alt="chart" width={20} height={20} className="w-5 h-5" />,
  },
  { name: "Product List", href: "/productList", icon: <ListChecks className="w-5 h-5" /> },
  { name: "Add Product", href: "/addProduct", icon: <ClipboardPlus className="w-5 h-5" /> },
  { name: "Update Product", href: "/updateProduct", icon: <Scissors className="w-5 h-5" /> },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const hideSidebar = ["/login", "/register"].includes(pathname);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthPage = ["/login", "/register"].includes(pathname);
      if (isAuthPage) {
        setCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/auth/current-user", {
          credentials: "include",
        });
        const data = await res.json();

        if (!data.success) {
          router.push("/login");
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        router.push("/login");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (checkingAuth) {
    return (
      <html lang="en">
        <body className={interFont.className}>
          <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={interFont.className}>
        <div className="bg-white min-h-screen flex">
          {!hideSidebar && (
            <aside className="flex flex-col h-screen w-64 bg-white text-gray-900 p-5 fixed shadow-md border-r-2 border-[#E6EDFF]">
              <div className="flex justify-center mb-5">
                <Image src="/logo.svg" alt="GST logo" width={96} height={80} className="h-20 w-24" />
              </div>

              <nav className="space-y-2 w-full">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center space-x-3 px-4 py-2 rounded-lg transition",
                      pathname === item.href ? "bg-gray-300" : "hover:bg-gray-200"
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto w-full pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/aboutUs"
                  className={clsx(
                    "flex items-center space-x-3 px-4 py-2 rounded-lg transition",
                    pathname === "/aboutUs"
                      ? "bg-gray-300"
                      : "hover:bg-gray-200"
                  )}
                >
                  <Trophy className="w-5 h-5" />
                  <span>About Us</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full text-left px-4 py-2 rounded-lg transition hover:bg-gray-100"
                >
                  <Image src="/logout.svg" alt="logout" width={20} height={20} className="w-5 h-5" />
                  <span>Log out</span>
                </button>
              </div>
            </aside>
          )}

          <main className={clsx("p-8 flex-1", !hideSidebar && "ml-64")}>{children}</main>
        </div>
      </body>
    </html>
  );
}
