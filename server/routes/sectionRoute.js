import { Router } from 'express';
import { sectionPost, questionsSection, getSections, McqSection, deleteSections ,getSectionsById,deleteSectionMcq,deleteSectionDescripive,getQuizSection,getQuestionsFromSection,startQuiz} from "../controller/sectioncontroller.js"

const sectionRoute = Router();

sectionRoute.route("/createsection").post(sectionPost);
sectionRoute.route("/createquestions/:sectionId").put(questionsSection);
sectionRoute.route("/getsections").get(getSections);
sectionRoute.route("/getsectionsbyid/:sectionId").get(getSectionsById);
sectionRoute.route("/mcqsections/:sectionId").put(McqSection);
sectionRoute.route("/deletesection/:sectionId").delete(deleteSections);
sectionRoute.route("/deletesectionmcq/:sectionId").put(deleteSectionMcq);
sectionRoute.route("/deletesectiondescriptive/:sectionId").put(deleteSectionDescripive);
sectionRoute.route("/startquiz").patch(startQuiz);
sectionRoute.route("/getquizsection").get(getQuizSection)
sectionRoute.route("/getquestionsfromsections/:sectionId").get(getQuestionsFromSection);







export default sectionRoute