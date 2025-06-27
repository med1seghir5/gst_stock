import mongoose from "mongoose";
const { Schema } = mongoose;


const UsersSchema = new Schema({
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: [true, "Veuillez entrer un nom d'utilisateur"],
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"]
  },
  refreshToken: {
    type: String,
    default: ''
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
    expDate: {
        type: Date,
        required: [true, "Expiration date is required"],
        index: { expires: 0 }
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
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
            immutable: true
        },
        username: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });
export const Product = mongoose.model('Product', ProductSchema);