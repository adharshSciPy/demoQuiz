import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import mongoose, { Schema } from "mongoose";
const defaultRole = process.env.ADMIN_ROLE
const adminSchema = new Schema({
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: Number,
        default: defaultRole
    }
}, { timestamps: true })


// hashing admin password

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        return next(error);
    }
})

// matching admin password
adminSchema.methods.isPasswordCorrect = async function (password) {
    if (password) {
        return await bcrypt.compare(password, this.password);
    }
    next();

}

export const Admin = mongoose.model("admin", adminSchema)