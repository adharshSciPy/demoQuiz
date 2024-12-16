import { Router } from "express";
import {registerSuperAdmin, superAdminLogin,adminLoginControl, getAllAdmins, deleteAdmin} from '../controller/superadmincontroller.js'
const superAdminRouter=Router();
superAdminRouter.route('/superadminregister').post(registerSuperAdmin)
superAdminRouter.route('/superadminlogin').post(superAdminLogin)
superAdminRouter.route('/adminlogincontrol').patch(adminLoginControl)
superAdminRouter.route('/getalladmins').get(getAllAdmins);
superAdminRouter.route('/deleteadmin').delete(deleteAdmin);





export default superAdminRouter