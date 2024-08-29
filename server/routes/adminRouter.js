import { Router } from 'express';
import { registerAdmin, login } from '../controller/admincontroller.js'

const adminRouter = Router();

adminRouter.route('/register').post(registerAdmin)
adminRouter.route('/login').post(login)


export default adminRouter