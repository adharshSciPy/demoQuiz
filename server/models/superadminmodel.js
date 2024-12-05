import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
const defaultRole = process.env.SUPER_ADMIN_ROLE;
const superAdminSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: Number,
      default: defaultRole,
    },
  },
  { timestamps: true }
);
// hashing password
superAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});
// generate access token
superAdminSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
// generate refresh token
superAdminSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
// matching SuperAdmin password
superAdminSchema.methods.isPasswordCorrect = async function (password) {
  if (password) {
    return await bcrypt.compare(password, this.password);
  }
  next();
};
export const SuperAdmin = mongoose.model("superAdmin", superAdminSchema);
