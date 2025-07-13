"use client";
import { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-poppins"
});

export default function AddressForm() {
  const [form, setForm] = useState({
    category: "",
    name: "",
    expDate: "",
    quant: "",
    onePrice: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/addproduct",
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        setSuccess("Product added successfully!");
      } else {
        setError("Error while adding product.");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError("Error" + err.response.data.message);
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-32">
        <form
          onSubmit={handleSubmit}
          className=" bg-white shadow-lg p-7 rounded-xl w-3xl h-3xl"
        >
        <Typography>
          <h2 className={`text-center text-gray-800 text-2xl mb-6 font-semibold ${poppins.className}`}>
            Add Product   
          </h2>
        </Typography>

        <div className="flex flex-col gap-y-6">
          <TextField
            name="category"
            label="Category"
            value={form.category}
            onChange={handleChange}
            required
            fullWidth
            className="bg-white rounded-lg"
          />
          <TextField
            name="name"
            label="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            className="bg-white rounded-md"
          />
          <TextField
            name="proDate"
            label="Production Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.proDate}
            onChange={handleChange}
            required
            fullWidth
            className="bg-white rounded-md"
          />  
          <TextField
            name="expDate"
            label="Expiration Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={form.expDate}
            onChange={handleChange}
            required
            fullWidth
            className="bg-white rounded-md"
          />
          <TextField
            name="quant"
            label="Quantity"
            type="number"
            value={form.quant}
            onChange={handleChange}
            required
            fullWidth
            className="bg-white rounded-md"
          />
          <TextField
            name="onePrice"
            label="Unit Price"
            type="number"
            value={form.onePrice}
            onChange={handleChange}
            required
            fullWidth
            className="bg-white rounded-md"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 bg-green-100 p-2 rounded">
              {success}
            </p>
          )}

          <Button
            type="submit"
            variant="text"
            className="!bg-blue-600 !text-white hover:!bg-blue-700 rounded-lg h-10 w-32 self-center"
          >
            <h4 className={`text-center ${poppins.className}`}>Add Product</h4>
          </Button>
        </div>
      </form>
    </div>
   
);
}
