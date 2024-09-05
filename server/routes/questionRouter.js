import { Router } from "express"
import { questionPost } from "../controller/questioncontroller.js";

const questionRouter = Router()

questionRouter.route("/createquestions").post(questionPost)



export default questionRouter