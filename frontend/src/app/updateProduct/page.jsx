"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-poppins",
});

export default function UpdateProduct() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3000/api/getproducts", {
        withCredentials: true,
      });
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Error while loading products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");
    try {
      await axios.delete(`http://localhost:3000/api/deleteproduct/${id}`, {
        withCredentials: true,
      });
      setProducts((prev) => prev.filter((prod) => prod._id !== id));
      setSuccess("Product deleted.");
    } catch (err) {
      console.error(err);
      setError("Error while deleting the product.");
    }
  };

  const handleUpdate = async (id) => {
    setError("");
    setSuccess("");
    const updatedProduct = products.find((p) => p._id === id);

    const cleanData = {
      name: updatedProduct.name,
      category: updatedProduct.category,
      quant: Number(updatedProduct.quant),
      onePrice: Number(updatedProduct.onePrice),
    };

    try {
      await axios.put(
        `http://localhost:3000/api/updateproduct/${id}`,
        cleanData,
        { withCredentials: true }
      );
      setSuccess("Product updated.");
    } catch (err) {
      console.error(err);
      setError("Error while updating the product.");
    }
  };

  const handleChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod._id === id ? { ...prod, [field]: value } : prod
      )
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-7">
      <h2 className={`text-2xl font-semibold mb-4 ${poppins.className}`}>
        Product List
      </h2>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {products.length === 0 && !loading && (
        <p className="text-gray-500">No products found.</p>
      )}

      <table className="bg-white shadow-md rounded-lg overflow-hidden w-full mt-4">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Arrival Date</th>
            <th className="px-4 py-2">Production Date</th>
            <th className="px-4 py-2">Expiration Date</th>
            <th className="px-4 py-2">Unit Price</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((prod) => (
            <tr key={prod._id}>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={prod.category}
                  onChange={(e) =>
                    handleChange(prod._id, "category", e.target.value)
                  }
                  className="text-center p-1 rounded w-full"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={prod.name}
                  onChange={(e) =>
                    handleChange(prod._id, "name", e.target.value)
                  }
                  className="text-center p-1 rounded w-full"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={prod.quant}
                  onChange={(e) =>
                    handleChange(prod._id, "quant", e.target.value)
                  }
                  className="text-center p-1 rounded w-full"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="date"
                  value={
                    prod.ariDate
                      ? new Date(prod.ariDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleChange(prod._id, "ariDate", e.target.value)
                  }
                  className="text-center p-1 rounded w-full"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="date"
                  value={
                    prod.proDate
                      ? new Date(prod.proDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleChange(prod._id, "proDate", e.target.value)
                  }
                  className="text-center p-1 rounded w-full"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="date"
                  value={
                    prod.expDate
                      ? new Date(prod.expDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleChange(prod._id, "expDate", e.target.value)
                  }
                  className="text-center p-1 rounded w-full"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={prod.onePrice}
                  onChange={(e) =>
                    handleChange(prod._id, "onePrice", e.target.value)
                  }
                  className="text-center p-1 rounded w-full"
                />
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => handleUpdate(prod._id)}
                  className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(prod._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
