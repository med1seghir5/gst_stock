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

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        email: form.email,
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword
      });

      if (response.status === 201) {
        router.push("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        "Error during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <img src="/Logo.svg" alt="Logo" className="mx-auto h-16 mb-8"/>
        
        <h1 className={`text-5xl font-semibold text-center mb-6 ${poppins.className}`}>Register</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-md font-medium mb-2 ${poppins.className}`}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className={`block text-md font-medium mb-2 ${poppins.className}`}>Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className={`block text-md font-medium mb-2 ${poppins.className}`}>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className={`block text-md font-medium mb-2 ${poppins.className}`}>Confirmez le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${poppins.className} w-full py-2 px-4 bg-blue-600 text-white rounded-md transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}