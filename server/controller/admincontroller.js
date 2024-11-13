import { Admin } from '../models/adminmodel.js'
import { User } from '../models/usermodel.js';
import { passwordValidator } from '../utils/passwordValidator.js';

// POST /admin/register

const registerAdmin = async (req, res) => {
    const { fullName, email, password } = req.body

    try {
        const isEmptyFields = [fullName, email, password].some(
            (field) => field.trim() === '' || field === undefined
        );
        if (isEmptyFields) {
            return res.status(401).json({ message: 'Please fill in all fields' });
        }

        const isValidPassword = passwordValidator(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }

        const existingAdmin = await Admin.findOne({ email: email });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const role = process.env.ADMIN_ROLE;
        const admin = await Admin.create({
            fullName,
            email,
            password,
            role
        })

        const createdAdmin = await Admin.findOne({ _id: admin._id }).select("-password")
        if (!createdAdmin) {
            return res.status(500).json({ message: 'Admin Registeration Failed' })
        }

        res.status(200).json({ message: 'Admin registered successfully', data: createdAdmin })

    } catch (error) {
        return res.error(500).json({ message: `Internal server error due to ${error.message}` })
    }
}

// POST /admin/login
const adminlogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const isEmptyField = [email, password].some(
            (field) => field.trim() === '' || field === undefined
        )
        if (isEmptyField) {
            return res.status(401).json({ message: 'All fields required    ' });
        }
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(401).json({ message: 'Admin Doesnt exist' });
        }
        const isPasswordCorrect = await admin.isPasswordCorrect(password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }
        //generate access token
        const accessToken = await admin.generateAccessToken();

        //generate refresh token
        const refreshToken = await admin.generateRefreshToken();
        //store refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // when going to production change boolean to true
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ message: "Admin Login Successfull", token: accessToken })
    } catch (error) {
        return res.status(500).json({ message: `Internal server due to ${error.message}` })
    }
}

//admin logout

const adminlogout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(204).json({ message: "Invalid Cookie" })
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,//Secure only in production
            sameSite: "None"
        })
        return res.status(200).json({ message: "Logout Successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Internal server error due to ${error.message}` })
    }
}

// to get descriptive answers from respective users using userid

const getUserDescriptiveAnswers = async (req, res) => {
    const { userId } = req.body;

    try {
        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Log the user sessions for debugging
        console.log("User sessions:", user.sessions);

        // Check if any session has been disqualified (whether or not descriptiveAnswers are present)
        const disqualifiedSession = user.sessions.find(session =>
            session.performance === "Disqualified"&&session.mcqAnswers.length===0
        );

        if (disqualifiedSession) {
            console.log("Disqualified session found:", disqualifiedSession);
            return res.status(200).json({ message: "User has been Disqualified" });
        }

        // Filter the sessions to get descriptive sessions where answers exist and performance is not "Disqualified"
        const descriptiveSessions = user.sessions.filter(session =>
            session.descriptiveAnswers && session.descriptiveAnswers.length > 0 && session.performance !== "Disqualified"
        );

        console.log("Filtered descriptive sessions:", descriptiveSessions); // Log filtered sessions

        // If no valid descriptive sessions are found
        if (descriptiveSessions.length === 0) {
            return res.status(200).json({ message: "No answers found" });
        }

        // If valid descriptive sessions are found, return the session data
        return res.status(200).json({ message: "User data found", descriptiveSessions });

    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};




// to post mark for respective users for  descriptiveQuestions
const descriptiveMark = async (req, res) => {
    const { userId, questionId, sectionId, mark } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({ message: "No user found" });
        }

        // Find the specific session by sectionId
        const session = user.sessions.find(s => s.sectionId.toString() === sectionId);
        if (!session) {
            return res.status(200).json({ message: "No session found for this section" });
        }

        // Find the specific descriptive answer by questionId
        const descriptiveAnswer = session.descriptiveAnswers.find(answer => answer.questionId.toString() === questionId);
        if (!descriptiveAnswer) {
            return res.status(200).json({ message: "No descriptive answer found for this question" });
        }

        // Update the mark for this descriptive answer
        descriptiveAnswer.markObtained = mark;

        // Recalculate the total score for the session
        let totalScore = 0;
        session.descriptiveAnswers.forEach(answer => {
            totalScore += answer.markObtained;
        });

        // Update the session's score
        session.score = totalScore;

        // Save the updated user document
        await user.save();

        // Return a success response
        return res.status(200).json({
            message: "Marks updated successfully",
            updatedScore: totalScore
        });

    } catch (error) {
        console.error("Error in descriptiveMark:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


export {
    registerAdmin, adminlogin, adminlogout,getUserDescriptiveAnswers,descriptiveMark
}