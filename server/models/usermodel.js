import { mongoose, Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const defaultRole = process.env.USER_ROLE;

// Schema for descriptive answers
const descriptiveAnswersSchema = new Schema({
    sectionId: {
        type: Schema.Types.ObjectId,
        ref: "Section",
        // required: true
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: "Questions",
        // required: true
    },
    answerText: {
        type: String
    }
});

// Schema for multiple-choice answers
const mcqAnswersSchema = new Schema({
    questionId: {
        type: Schema.Types.ObjectId,
        ref: "Questions",
        required: false
    },
    selectedOption: {
        type: String
    },
    isCorrect: {
        type: Boolean
    }
});

// Schema for each session performance
const sessionSchema = new Schema({
    sectionId: {
        type: Schema.Types.ObjectId,
        ref: "Section",
        required: true
    },
    mcqAnswers: [mcqAnswersSchema],
    descriptiveAnswers: [descriptiveAnswersSchema],
    score: {
        type: Number,
        default: 0
    },
    performance: {
        type: String
    },
    completedAt: {
        type: Date
    }
});

const userSchema = new Schema({
    fullName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: defaultRole
    },
    hasLoggedIn: {
        type: Boolean,
        default: false
    },
    sessions: [sessionSchema],  // Array to store each session's performance
    userStrength: {
        type: String
    },
    batch: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Hashing password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        return next(error);
    }
});

// Generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            fullName: this.fullName,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

// Matching password for login
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to initialize a new session for each login
userSchema.methods.startNewSession = function(sectionId) {
    const newSession = {
        sectionId,
        mcqAnswers: [],
        descriptiveAnswers: [],
        score: 0,
        performance: null
    };
    this.sessions.push(newSession);
    return this.save();
};

export const User = mongoose.model("User", userSchema);
