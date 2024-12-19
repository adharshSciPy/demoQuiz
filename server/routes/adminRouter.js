import { Router } from 'express';
import { registerAdmin, adminlogin, adminlogout, getUserDescriptiveAnswers ,descriptiveMark, userControl,editAdmin, forgotPassword, resetPassword ,showAdmin} from '../controller/admincontroller.js'
import upload from '../multer/multer.js';
const adminRouter = Router();

adminRouter.route('/register').post(registerAdmin)
adminRouter.route('/login').post(adminlogin)
adminRouter.route('/logout').post(adminlogout)
adminRouter.route('/getdescriptiveAnswerfromUser').get(getUserDescriptiveAnswers)
adminRouter.route('/descriptiveMark/:userId').patch(descriptiveMark);
// adminRouter.route('/resetadminpassword').patch(resetPassword);
adminRouter.route('/userstatuscontrol').patch(userControl);
adminRouter.route("/editWithUpload/:id").patch(upload.single("image"), editAdmin);
adminRouter.route("/showAdmin/:id").get(showAdmin);     
adminRouter.route('/forgotpassword').post(forgotPassword);
adminRouter.route('/resetpassword/:id/:token').post(resetPassword);








export default adminRouter