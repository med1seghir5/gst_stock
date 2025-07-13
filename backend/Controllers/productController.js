import { Product } from "../Schema/schema.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
    try {
        const { category, name, ariDate, proDate, expDate, quant, onePrice } = req.body;

        if (!category || !name || !proDate || !expDate || !quant || !onePrice) {
            return res.status(400).json({ 
                success: false,
                message: "Missing required fields" 
            });
        }

        if (!req.user || !req.user._id || !req.user.username) {
            return res.status(401).json({
                success: false,
                message: "User information missing or incomplete"
            });
        }

        const product = await Product.create({
            category,
            name,
            ariDate,
            proDate,
            expDate, 
            quant,
            onePrice,
            user: {
                userId: req.user._id,
                username: req.user.username
            }
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch(error) {
        console.error("Error in createProduct:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        console.log("User making request: ", req.user._id);
        
        const products = await Product.find({ 'user.userId': req.user._id })
            .select('-__v')
            .lean();

        if( products.length === 0 ) {
            return res.status(200).json({
                success: true,
                message: "No products found for this user",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            count: products.length,
            data: products
        })

    } catch( error ){
        console.error("In getProducts: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        })
    }
}

export const getProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format"
            });
        }

        const product = await Product.findOne({ 
            _id: req.params.id,
            'user.userId': req.user._id
        }).select('-__v');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or access denied"
            });
        }

        return res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error("In getProduct: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        })
    }
};

export const modifyProduct = async(req, res) => {
    try{
        const modifyproduct = await Product.findOneAndUpdate({
             _id: req.params.id,
            'user.userId': req.user._id
        },
        req.body,
       { new: true }
       );

       if(!modifyproduct){
            return res.status(404).json({
                message: "Product not found"
            });
       };

       res.status(200).json({
        success: true,
        data: modifyproduct
       });

    } catch(error) {
        console.error("In modifyProduct: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        })
    }
}

export const deleteProduct = async(req, res) => {
    try{
        const deleteproduct = await Product.findOneAndDelete({
             _id: req.params.id,
            'user.userId': req.user._id
        });

       if(!deleteproduct){
            return res.status(404).json({
                message: "Product not found"
            });
       };

       res.status(200).json({
        success: true,
        message: "Product deleted",
        data: deleteproduct
       });

    } catch(error) {
        console.error("In modifyProduct: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        })
    }
}

