import { Router } from 'express'
import { registerUser, loginUser, refreshAccessToken, logoutUser, getMcquestions,getDescriptiveQuestions, submitQuiz,submitQuizMcq, getAllUsers,submitQuizDescriptive ,descriptiveQuizSubmit} from '../controller/usercontroller.js'

const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/refresh').get(refreshAccessToken)
userRouter.route('/logout').post(logoutUser)
userRouter.route('/getMcquestions/:sectionId').get(getMcquestions)
userRouter.route('/getDescriptiveQuestions/:sectionId').get(getDescriptiveQuestions)

userRouter.route('/quizSubmit/:userId').patch(submitQuiz)
userRouter.route('/quizsubmitmcq/:userId').patch(submitQuizMcq)
userRouter.route('/quizsubmitdescriptive/:userId').post(submitQuizDescriptive)
userRouter.route('/descriptivequizsubmit/:userId').post(descriptiveQuizSubmit)



userRouter.route('/getUsers').get(getAllUsers)

export default userRouter