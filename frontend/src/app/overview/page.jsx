"use client"; // pour Next.js seulement

import { useEffect, useState } from "react";
import axios from "axios";

export default function Overview() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/current-user", {
          withCredentials: true, // important for cookies
        });

        if (response.data.success && response.data.user?.username) {
          setUsername(response.data.user.username);
        } else {
          console.log("No user received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>
        {loading
          ? "Loading..."
          : username
          ? `Welcome, ${username} 👋`
          : "No user logged in"}
      </h2>
    </div>
  );
}
