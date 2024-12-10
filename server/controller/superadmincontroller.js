import { SuperAdmin } from "../models/superadminmodel.js";
import { Admin } from "../models/adminmodel.js";
import { passwordValidator } from "../utils/passwordValidator.js";
// POST/superAdmin/register
const registerSuperAdmin=async(req,res)=>{
    const {fullName,email,password}=req.body;
    try {
        const isEmptyFields=[fullName,email,password].some((field)=>field.trim()===''||field===undefined);
        if(isEmptyFields){
            return res.status(401).json({message:"Please fill in all fields "});
        }
        const isValidPassword=passwordValidator(password);
        if(!isValidPassword){
            return res.status(401).json({ message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }
        const existingSuperAdmin=await SuperAdmin.findOne({email:email});
        if(existingSuperAdmin){
            return res.status(409).json({ message: 'Email already in use' });
        }
        const role=process.env.SUPER_ADMIN_ROLE;
        const superadmin=await SuperAdmin.create({
            fullName,
            email,
            password,
            role
        })
        const createdSuperAdmin=await SuperAdmin.findOne({
            _id:superadmin._id
        }).select("-password")
        // console.log("created SuperAdmin",createdSuperAdmin)
        if(!createdSuperAdmin){
            return res.status(500).json({ message: 'Super Admin Registeration Failed' })
        }
        res.status(200).json({ message: ' Super Admin registered successfully', data: createdSuperAdmin })
    } catch (error) {
        return res.status(500).json({ message: `Internal server error due to ${error.message}` });
    }
}

// POST/superAdmin Login
const superAdminLogin=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const isEmptyFields=[email,password].some((field)=>field.trim()===''||field===undefined)
        if(isEmptyFields){
            return res.status(401).json({ message: 'All fields required    ' });
        }
        const superadmin=await SuperAdmin.findOne({email:email});
        if(!superadmin){
            return res.status(401).json({ message: 'Super Admin Doesnt exist' });
        }
        const isPasswordCorrect=await superadmin.isPasswordCorrect(password);
        if(!isPasswordCorrect){
            return res.status(401).json({ message: 'Incorrect Password' });
        }
        // generate access token
        const accessToken=await superadmin.generateAccessToken();
         //generate refresh token
         const refreshToken = await superadmin.generateRefreshToken();
        // store refresh token in cookie
        res.cookie("refreshToken",refreshToken,{
            httpOnly: true,
            secure: false, // when going to production change boolean to true
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ message: "Super Admin Login Successfull", token: accessToken })

    } catch (error) {
        return res.status(500).json({ message: `Internal server due to ${error.message}` })
    }

}
const adminLoginControl = async (req, res) => {
    const { id } = req.body;

    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

     
        admin.isEnabled = !admin.isEnabled; 
        await admin.save();

        const status = admin.isEnabled ? "enabled" : "disabled";
        console.log("hellooo",status)

        return res.status(200).json({ 
            message: `Admin has been ${status}`, 
            admin 
        });
    } catch (error) {
        return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
};

const getAllAdmins=async (req,res)=>{
    try {
        const response=await Admin.find();
        return res.status(200).json({message:"Admins list fetch succesfull",response})
    } catch (error) {
        return res.status(500).json({ message: `Internal server due to ${error.message}` })
        
    }
}


export{
    registerSuperAdmin,superAdminLogin,adminLoginControl,getAllAdmins
}