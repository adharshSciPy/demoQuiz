import { Admin } from '../models/adminmodel.js'
import { User } from '../models/usermodel.js';
import { passwordValidator } from '../utils/passwordValidator.js';
import { Section } from '../models/sectionmodel.js';
import  bcrypt from 'bcryptjs'

// POST /admin/register

const registerAdmin = async (req, res) => {
    const { fullName, email, password,date } = req.body

    try {
        const isEmptyFields = [fullName, email, password,date].some(
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
            date,
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
            return res.status(401).json({ message: 'All fields required' });
        }
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(401).json({ message: 'Admin Doesnt exist' });
        }
        const isPasswordCorrect = await admin.isPasswordCorrect(password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Incorrect Password' });
          
        }
        
      
        if(!admin.isEnabled){
            return res.status(401).json({ message: 'Admin Login has been disabled' });

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
    const { userId, sessionId } = req.query;

    try {
        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the session by sessionId within the user's sessions array
        const session = user.sessions.find(s => s._id.toString() === sessionId);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Check if the session is disqualified
        if (session.performance === "Disqualified") {
            return res.status(200).json({ message: "User has been disqualified" });
        }

        // Check if the session has descriptive answers
        if (!session.descriptiveAnswers || session.descriptiveAnswers.length === 0) {
            return res.status(200).json({ message: "No answers found" });
        }

        // Return the descriptive answers
        return res.status(200).json({
            message: "User data found",
            descriptiveAnswers: session.descriptiveAnswers,
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};





// to post mark for respective users for  descriptiveQuestions
const descriptiveMark = async (req, res) => {
    const { questionId, sectionId, mark } = req.body;
    const { userId } = req.params;

    try {
        const numericMark = parseFloat(mark);
        if (isNaN(numericMark)) {
            return res.status(400).json({
                message: "Invalid mark. Please provide a valid numeric value.",
            });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the specific session by sectionId
        const session = user.sessions.find(s => s.sectionId.toString() === sectionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found for this section" });
        }

        // Find the section to get the maximum marks for the question
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        // Find the question in the section's Questions array
        const question = section.Questions.find(q => q._id.toString() === questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const maxMark = parseFloat(question.mark);
        if (isNaN(maxMark)) {
            return res.status(500).json({
                message: "Invalid maximum mark in question. Please check the question data.",
            });
        }

        // Check if the provided mark exceeds the maximum allowed mark
        if (numericMark > maxMark) {
            return res.status(400).json({
                message: `Mark cannot exceed the maximum mark of ${maxMark} for this question.`,
            });
        }

        // Find the specific descriptive answer in the session
        const descriptiveAnswer = session.descriptiveAnswers.find(
            answer => answer.questionId.toString() === questionId
        );
        if (!descriptiveAnswer) {
            return res.status(404).json({ message: "Descriptive answer not found" });
        }

        // Update the mark for this answer
        descriptiveAnswer.markObtained = numericMark;

        // Recalculate the total score for the session
        let totalScore = session.descriptiveAnswers.reduce((total, answer) => {
            return total + (answer.markObtained || 0); // Fallback for undefined marks
        }, 0);

        // Update the session's score
        session.score = totalScore;

        // Save the updated user document
        await user.save();

        return res.status(200).json({
            message: "Marks updated successfully",
            updatedScore: totalScore,
        });
    } catch (error) {
        console.error("Error in descriptiveMark:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};
// to reset admin password
const resetPassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        const isOldPasswordCorrect = await admin.isPasswordCorrect(oldPassword);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

       
        admin.password = newPassword;
        await admin.save();

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
// to control user login
const userControl=async(req,res)=>{
    const{id}=req.body;
    try {
        const user=await User.findById(id);
        if(!user){
            return res.status(401).json({message:"User not found"})
        } 
        user.isEnabled=!user.isEnabled;
        await user.save();
        const status=user.isEnabled?"enabled":"disabled";
        return res. status(200).json({
            message:`User has been ${status}`,
            user
        })
    } catch (error) {
        return res.status(500).json({message:"Internal server Error",error})
    }
}

const editAdmin = async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const { fullName,schoolName,phoneNumber,address} = req.body;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        // Update admin record with the provided data
        const editResult = await Admin.findByIdAndUpdate(
            id,
            {
                fullName,
                image: `/uploads/${file.filename}`,
                schoolName,
                phoneNumber,
                address
            },
            { new: true } // Return the updated document
        );

        if (!editResult) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.status(200).json({
            message: "Updated successfully",
            data: editResult,
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};






export {
    registerAdmin, adminlogin, adminlogout,getUserDescriptiveAnswers,descriptiveMark,resetPassword,userControl,editAdmin
}