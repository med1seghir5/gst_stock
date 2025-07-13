"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const publicRoutes = ["/login", "/register"];
  const isPublic = publicRoutes.includes(pathname);

  useEffect(() => {
    const isLoggedIn = document.cookie.includes("accessToken=");
    if (!isLoggedIn && !isPublic) {
      router.push("/login");
    }
  }, [pathname]);

  return children;
}
