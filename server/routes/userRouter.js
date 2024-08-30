import { Router } from 'express'
import { registerUser, loginUser, refreshAccessToken, logoutUser } from '../controller/usercontroller.js'

const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/refresh').get(refreshAccessToken)
userRouter.route('/logout').post(logoutUser)

export default userRouter