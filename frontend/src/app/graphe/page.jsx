"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-inter"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-poppins"
});

const groupByDateSum = (products) => {
  const grouped = {};

  products.forEach((prod) => {
    const date = new Date(prod.createdAt).toLocaleDateString();
    const total = prod.quant * prod.onePrice;

    if (grouped[date]) {
      grouped[date] += total;
    } else {
      grouped[date] = total;
    }
  });

  const formattedData = Object.keys(grouped).map((date) => ({
    date,
    total: grouped[date],
  }));

  const firstDate = formattedData[0]?.date;
  let spacer = "";

  if (firstDate) {
    const [day, month, year] = firstDate.split("/");
    const jsDate = new Date(`${year}-${month}-${day}`);
    jsDate.setDate(jsDate.getDate() - 1);
    spacer = jsDate.toLocaleDateString();
  }

  return [{ date: spacer, total: 0 }, ...formattedData];
};

export default function ProductAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/getproducts", {
          withCredentials: true,
        });

        if (res.data.success && Array.isArray(res.data.data)) {
          const transformed = groupByDateSum(res.data.data);
          setData(transformed);
        }
      } catch (error) {
        console.error("Product API error :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box className="border-2 rounded-lg shadow-[#000000] shadow-lg border-[#E6EDFF]">
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h6" mb={2} className={poppins.className}>
          Total purchases by date
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 30, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" padding={{ left: 30, right: 10 }} />
              <YAxis />
              <Tooltip formatter={(val) => `${val.toLocaleString()} DZD`} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#1976d2"
                strokeWidth={2}
                name="Total"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
}
