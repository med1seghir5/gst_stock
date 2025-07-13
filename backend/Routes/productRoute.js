import express from "express";
import { createProduct, deleteProduct, getProduct, getProducts, modifyProduct } from "../Controllers/productController.js";
import { authenticateToken } from "../Middlewares/authMiddlewares.js";


const router = express.Router();

router.use(authenticateToken);
router.get("/getproducts", getProducts);
router.get("/getproduct/:id", getProduct);
router.post("/addproduct", createProduct);
router.put("/updateproduct/:id", modifyProduct);
router.delete("/deleteproduct/:id", deleteProduct);

export default router;