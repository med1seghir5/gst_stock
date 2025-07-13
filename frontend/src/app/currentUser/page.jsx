import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/current-user", {
          withCredentials: true,
        });

        if (res.data.success) {
          setUsername(res.data.user.username);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-4">
      {username ? (
        <h1 className="text-xl font-bold">Bienvenue, {username}!</h1>
      ) : (
        <p>Chargement du profil...</p>
      )}
    </div>
  );
};

export default UserProfile;
