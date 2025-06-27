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

// ✅ Fonction modifiée pour ajouter un espace (date antérieure avec total 0)
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

  // ✅ Ajouter une date antérieure (veille du premier point) avec total 0
  const firstDate = formattedData[0]?.date;
  let spacer = "";

  if (firstDate) {
    const [day, month, year] = firstDate.split("/"); // format local FR: dd/mm/yyyy
    const jsDate = new Date(`${year}-${month}-${day}`);
    jsDate.setDate(jsDate.getDate() - 1); // la veille
    spacer = jsDate.toLocaleDateString(); // ex: "21/06/2025"
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
    <Box sx={{ padding: 2, minHeight: "100vh" }}>
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h6" mb={2}>
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
              <XAxis
                dataKey="date"
                padding={{ left: 30, right: 10 }}
              />
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
