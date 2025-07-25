import express from "express";
import { getCurrentUser, Login, Logout, protectRoute, refreshToken, Register } from "../Controllers/authController.js";
import { authenticateToken } from "../Middlewares/authMiddlewares.js";


const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/token", refreshToken);
router.get("/protectroute", protectRoute);
router.get("/current-user", authenticateToken, getCurrentUser);

export default router; 