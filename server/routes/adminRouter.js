import { Router } from 'express';
import { registerAdmin, adminlogin, adminlogout, getUserDescriptiveAnswers ,descriptiveMark} from '../controller/admincontroller.js'

const adminRouter = Router();

adminRouter.route('/register').post(registerAdmin)
adminRouter.route('/login').post(adminlogin)
adminRouter.route('/logout').post(adminlogout)
adminRouter.route('/getdescriptiveAnswerfromUser').get(getUserDescriptiveAnswers)
adminRouter.route('/descriptiveMark/:userId').patch(descriptiveMark)



export default adminRouter