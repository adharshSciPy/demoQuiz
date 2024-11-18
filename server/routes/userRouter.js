import { Router } from 'express'
import { registerUser, loginUser, refreshAccessToken, logoutUser, getMcquestions,getDescriptiveQuestions, submitQuiz,submitQuizMcq, getAllUsers,submitQuizDescriptive ,descriptiveQuizSubmit, checkUserQuizSubmit,getUserById, getUserWiseMcq, getSingleMcquestions, getSingleDescriptiveQuestions} from '../controller/usercontroller.js'

const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/refresh').get(refreshAccessToken)
userRouter.route('/logout').post(logoutUser)
userRouter.route('/getMcquestions/:sectionId').get(getMcquestions)
userRouter.route('/getDescriptiveQuestions/:sectionId').get(getDescriptiveQuestions)

userRouter.route('/quizSubmit/:userId').patch(submitQuiz)
userRouter.route('/quizsubmitmcq/:userId/:sectionId').patch(submitQuizMcq)
userRouter.route('/quizsubmitdescriptive/:userId').post(submitQuizDescriptive)
userRouter.route('/descriptivequizsubmit/:userId/:sectionId').post(descriptiveQuizSubmit)
userRouter.route('/checkuserquizsubmit/:userId/:sectionId').get(checkUserQuizSubmit)



userRouter.route('/getuserById/:userId').get(getUserById)


userRouter.route('/getUsers').get(getAllUsers)
userRouter.route('/getuserwisemcq/:userId/:sessionId').get(getUserWiseMcq)
userRouter.route('/getsinglemcqquestion/:sectionId').get(getSingleMcquestions)
userRouter.route('/getsingledescriptivequestion/:sectionId').get(getSingleDescriptiveQuestions)




export default userRouter