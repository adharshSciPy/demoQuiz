import { Router } from 'express'
import { registerUser, loginUser, refreshAccessToken, logoutUser, getQuestions, submitQuiz } from '../controller/usercontroller.js'

const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/refresh').get(refreshAccessToken)
userRouter.route('/logout').post(logoutUser)
userRouter.route('/getQuestions').get(getQuestions)
userRouter.route('/quizSubmit').post(submitQuiz)

export default userRouter