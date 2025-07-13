import React from "react";
import { Inter, Poppins } from "next/font/google";

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

const Aboutus = () => {
  return (
    <div className="flex justify-center items-center min-h-screen text-center">
        <div className="flex flex-row items-center justify-center gap-40">
            <div>
                 <img src="/logo.svg" alt="Gst_logo" className="h-64" />
            </div>
            <div className="flex flex-col justify-center gap-4 text-left">
                <h3 className={`text-5xl font-semibold ${poppins.className}`}>About Us</h3>
                <p className={`text-[#7C8DB5] text-xl ${poppins1.className}`}>
                    Our Stock Management Web Application allows users to easily add, edit, and delete products from their inventory. <br />
                    It also provides a clear and organized view of the entire product list, <br />
                    making it easy to track stock levels and manage updates in real time. With a simple and intuitive interface,<br /> 
                    businesses can efficiently control their inventory and ensure that their product data is always accurate and up to date.
                </p>
            </div>
        </div>
    </div>

  );
};

export default Aboutus;
