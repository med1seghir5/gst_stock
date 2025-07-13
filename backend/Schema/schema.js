import mongoose from "mongoose";
const { Schema } = mongoose;


const UsersSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  refreshToken: {
    type: String,
    default: '',
  }
});

export const Users = mongoose.model("Users", UsersSchema);

const ProductSchema = new Schema({
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    ariDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    proDate: {
        type: Date,
        required: [true, "Production date is required"],
    },
    expDate: {
        type: Date,
        required: [true, "Expiration date is required"]
    },
    quant: {
        type: Number,
        default: 0,
        min: [0, "Quantity can't be negative"]
    },
    onePrice: {
        type: Number,
        required: [true, "Price is required"],
        min: [0.01, "Price must be positive"]
    },
    user: {
        type: {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
            username: { type: String, required: true }
        },
        required: true
    }
}, { timestamps: true });
export const Product = mongoose.model('Product', ProductSchema);