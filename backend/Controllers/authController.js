import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Users } from '../Schema/schema.js';
import dotenv from 'dotenv';

dotenv.config();

export const Register = async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  try {
    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Les mots de passe ne correspondent pas" });
    }

    const existUser = await Users.findOne({ $or: [{ email }, { username }] });

    if (existUser) {
      return res.status(400).json({ success: false, message: "L'utilisateur existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Users({ email, username, password: hashedPassword });
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "Utilisateur enregistré avec succès",
      user: userResponse
    });

  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      success: false,
      message: "Échec de l'inscription",
      error: err.message
    });
  }
};

export const Login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await Users.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id }, // ✅ utilisé "id"
      process.env.SECRET_ACCESS,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id }, // ✅ aussi ici
      process.env.SECRET_REFRESH,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message
    });
  }
};

export const Logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    if (refreshToken) {
      await Users.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } }
      );
    }

    return res.json({ success: true, message: "Logged out successfully" });

  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Logout failed", error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(403).json({ success: false, message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.SECRET_REFRESH);
    const user = await Users.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id }, // ✅ cohérent
      process.env.SECRET_ACCESS,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000
    });

    return res.json({ success: true, message: "Token refreshed successfully", accessToken: newAccessToken });

  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(403).json({ success: false, message: "Invalid refresh token" });
  }
};

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_ACCESS);
    const user = await Users.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("Authentication error:", err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      message: "Utilisateur connecté",
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    console.error("Erreur current-user:", err);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
