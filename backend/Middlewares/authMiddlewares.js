import jwt from 'jsonwebtoken';
import { Users } from '../Schema/schema.js';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_ACCESS);

        const user = await Users.findById(decoded._id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(403).json({
            success: false,
            message: error.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid token',
        });
    }
};
