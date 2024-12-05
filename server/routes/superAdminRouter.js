import { Router } from "express";
import {registerSuperAdmin, superAdminLogin,adminLoginControl, getAllAdmins} from '../controller/superadmincontroller.js'
const superAdminRouter=Router();
superAdminRouter.route('/superadminregister').post(registerSuperAdmin)
superAdminRouter.route('/superadminlogin').post(superAdminLogin)
superAdminRouter.route('/adminlogincontrol').patch(adminLoginControl)
superAdminRouter.route('/getalladmins').get(getAllAdmins)




export default superAdminRouter