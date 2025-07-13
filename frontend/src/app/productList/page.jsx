"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-poppins",
});

export default function ProductList() {
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
      console.error(err);
      setError("Error while loading products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className={`text-xl font-semibold ${poppins.className}`}>
            Product List
          </h2>
        </div>

        {loading && (
          <p className="p-4 text-blue-500">Loading...</p>
        )}
        {error && <p className="p-4 text-red-500">{error}</p>}

        {!loading && !error && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Arrival Date</th>
                  <th className="px-4 py-3">Production Date</th>
                  <th className="px-4 py-3">Expiration Date</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Total Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((prod, index) => (
                  <tr key={prod._id}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{prod.category}</td>
                    <td className="px-4 py-3">{prod.name}</td>
                    <td className="px-4 py-3">{prod.quant}</td>
                    <td className="px-4 py-3">
                      {new Date(prod.ariDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(prod.proDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(prod.expDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{prod.onePrice} DA</td>
                    <td className="px-4 py-3 text-green-600 font-semibold">
                      {prod.quant * prod.onePrice} DA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="p-4 text-gray-600">No products available.</p>
        )}
      </div>
    </div>
  );
}
