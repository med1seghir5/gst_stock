"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductAnalytics from "../graphe/page";
import { Inter, Poppins } from "next/font/google";
import { User2 } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-poppins",
});

const poppins1 = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-inter",
});

export default function Overview() {
  const [username, setUsername] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/getproducts", {
        withCredentials: true,
      });
      if (res.data.success && Array.isArray(res.data.data)) {
        setProducts(res.data.data);
      } else {
        setProducts([]);
        setError("No products found.");
      }
    } catch (err) {
      setError("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/current-user", {
          withCredentials: true,
        });
        if (response.data.success && response.data.user?.username) {
          setUsername(response.data.user.username);
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };
    fetchUser();
  }, []);

  const totalProducts = products.length;
  const totalCategories = new Set(products.map((p) => p.category)).size;
  const totalPrice = products.reduce((sum, p) => sum + (p.quant || 0) * (p.onePrice || 0), 0);

  return (
    <div className="space-y-32 md:px-10">
      <section className="flex flex-row justify-between items-center">
        <div className="flex flex-col justify-between items-start gap-y-1">
          <h2 className={`text-[#000000] text-4xl font-semibold ${poppins.className}`}>
            {loading
              ? "Loading..."
              : username
              ? `Welcome Back, ${username} 👋`
              : "No user logged in"}
          </h2>
          <h3 className={`text-[#7C8DB5] text-xl ${poppins1.className}`}>
            Here is the information about all your orders
          </h3>
        </div>
        <div className="flex flex-row gap-3 items-center">
          <User2 />
          <h2 className={`text-[#1E1E1E] text-xl font-semibold ${inter.className}`}>
            {username || "No user"}
          </h2>
        </div>
      </section>

      <div className="flex justify-center">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-64">
          <div className="flex flex-row justify-center items-center gap-7 rounded-lg shadow-[#000000] shadow-lg border-2 border-[#E6EDFF] bg-white p-1 w-96 h-28">
            <div className="flex flex-col justify-center items-center">
              <p className={`text-3xl font-bold text-[#000000] ${poppins.className}`}>
                {totalCategories}
              </p>
              <h3 className={`text-lg font-semibold text-[#000000] ${poppins1.className}`}>
                Total Categories
              </h3>
            </div>
            <div>
              <img src="./chart-column-stacked.svg" className="h-12" />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-7 rounded-lg shadow-[#000000] shadow-lg border-2 border-[#E6EDFF] bg-white p-1 w-80 h-28">
            <div className="flex flex-col justify-center items-center">
              <p className={`text-3xl font-bold text-[#000000] ${poppins.className}`}>
                {totalProducts}
              </p>
              <h3 className={`text-lg font-semibold text-[#000000] ${poppins1.className}`}>
                Total Products
              </h3>
            </div>
            <div>
              <img src="./shopping-basket.svg" className="h-12" />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-7 rounded-lg shadow-[#000000] shadow-lg border-2 border-[#E6EDFF] bg-white p-1 w-80 h-28">
            <div className="flex flex-col justify-center items-center">
              <p className={`text-3xl font-bold text-[#000000] ${poppins.className}`}>
                {totalPrice} DA
              </p>
              <h3 className={`text-lg font-semibold text-[#000000] ${poppins1.className}`}>
                Total Price
              </h3>
            </div>
            <div>
              <img src="./circle-dollar-sign.svg" className="h-12" />
            </div>
          </div>
        </section>
      </div>
      
      <section>
        <ProductAnalytics />
      </section>

      <section className="mt-10">
        <h2 className={`text-2xl font-semibold text-[#1E1E1E] mb-6 ${poppins.className}`}>
          Products List
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div
                key={product._id || index}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
              >
                <div className="mb-4">
                  <h3 className={`text-xl font-bold text-[#000000] mb-2 ${poppins.className}`}>
                    {product.name}
                  </h3>
                  <p className={`text-sm text-[#7C8DB5] ${poppins1.className}`}>
                    Category: {product.category}
                  </p>
                  <p className={`text-sm text-[#7C8DB5] ${poppins1.className}`}>
                    Quantity: {product.quant}
                  </p>
                  <p className={`text-sm text-[#7C8DB5] ${poppins1.className}`}>
                    Unit Price: {product.onePrice} DA
                  </p>
                  <p className={`text-sm text-[#7C8DB5] ${poppins1.className}`}>
                    Total: {product.quant * product.onePrice} DA
                  </p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  By {product.user?.username || "Unknown"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-center text-[#7C8DB5] mt-4 ${poppins1.className}`}>
            {loading ? "Loading products..." : error || "No products to display."}
          </p>
        )}
      </section>
    </div>
  );
}
