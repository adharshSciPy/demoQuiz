import { User } from "../models/usermodel.js";
import { Admin } from "../models/adminmodel.js";

import jwt from "jsonwebtoken";
import { passwordValidator } from "../utils/passwordValidator.js";

// @POST
// user/register
// desc: Api for creating new admins
const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // sanitiasing inputs
        const isEmptyFields = [fullName, email, password].some(
            (field) => field === "" || field === undefined
        );
        if (isEmptyFields) {
            return res.status(401).json({ message: "All fields are required" });
        }

        //validate password
        const isValidPassword = passwordValidator(password);

        if (!isValidPassword) {
            return res.status(401).json({
                message:
                    "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one number",
            });
        }

        //prevent duplicate accounts
        const isAlreadyExistingUser = await User.findOne({ email: email });
        const isAlreadyExistingAdmin = await Admin.findOne({ email: email });
        if (
            isAlreadyExistingUser ||
            isAlreadyExistingAdmin
        ) {
            return res.status(409).json({ message: "Email is already in use" });
        }

        //user creation
        const role = process.env.USER_ROLE;
        const user = await User.create({
            fullName,
            email,
            password,
            role
        });
        const createdUser = await User.findOne({ _id: user._id }).select(
            "-password"
        );

        if (!createdUser) {
            return res.status(500).json({ message: "User registration failed" });
        }

        return res.status(201).json({ message: "User Registration Successful" });
    } catch (err) {
        return res
            .status(500)
            .json({ message: `Internal Server due to ${err.message}` });
    }
};

// @POST
// user/login
// desc:Login api of admin with credentials
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sanitize and validate input
        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the user
        const models = [User, Admin];
        let user = null;

        for (const model of models) {
            user = await model.findOne({ email });
            if (user) break;
        }

        if (!user) {
            return res.status(404).json({ message: "Email doesn't exist" });
        }

        // Verify password
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate tokens
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: "Validation Successful", token: accessToken });
    } catch (err) {
        return res.status(500).json({ message: `Internal Server Error due to ${err.message}` });
    }
};

// user/refresh
// desc: To create new access token once it has expired (for all user roles -> Admin, Company and User)
const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized API request" });
    }

    try {
        // Verify refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(403).json({ message: "Refresh token expired. Please log in again." });
                }
                return res.status(403).json({ message: "Forbidden. Invalid token." });
            }

            let user;
            const role = Number(decoded.role)

            // Retrieve user based on role from decoded token
            if (!role) {
                return res.status(403).json({ message: "Forbidden. Invalid user role." });
            }

            const adminRole = Number(process.env.ADMIN_ROLE);
            const userRole = Number(process.env.USER_ROLE);

            switch (role) {
                case adminRole:
                    user = await Admin.findOne({ _id: decoded.id });
                    break;
                case userRole:
                    user = await User.findOne({ _id: decoded.id });
                    break;
                default:
                    return res.status(404).json({ message: "Invalid role" });
            }

            if (!user) {
                return res.status(404).json({ message: "Cannot find user" });
            }

            // Generate new access token
            const accessToken = await user.generateAccessToken();

            // Respond with success message and new access token
            return res.status(200).json({ message: "User validation successful", data: accessToken });
        });

    } catch (err) {
        return res.status(500).json({ message: `Internal server error due to ${err.message}` });
    }
};

// @POST
// user/logout
// desc: To logout a user and clear cookies
const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(204).json({ message: "Invalid Cookie" });
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true, // Secure only in production
            sameSite: "None",
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("Error during logout:", err);
        return res
            .status(500)
            .json({ message: `Internal Server Error: ${err.message}` });
    }
};

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
};
