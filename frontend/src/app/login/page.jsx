"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-poppins"
});

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    identifier: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {
          identifier: form.identifier,
          password: form.password
        },
        { withCredentials: true }
      );

      console.log("User connected: ", response.data);

      if (response.data.success) {
        router.push("/");
      }

    } catch (error) {
      setError(error.response?.data?.message || "Connection error");
      console.error("Connection error: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-10">
        <img src="/Logo.svg" alt="Logo" className="mx-auto h-16 mb-12"/>
        
        <h1 className={`text-5xl font-semibold text-center mb-6 ${poppins.className}`}>Login</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-5">
              <div>
              <label className={`block text-md font-medium mb-2 ${poppins.className}`}>Email or Username</label>
                <input
                  type="text"
                  name="identifier"
                  value={form.identifier}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            <div>
              <label className={`block text-md font-medium mb-2 ${poppins.className}`}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md transition ${poppins.className}`}
            >
              Login
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
