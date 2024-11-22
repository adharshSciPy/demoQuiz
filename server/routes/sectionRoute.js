import { Router } from 'express';
import { sectionPost, questionsSection, getSections, McqSection, deleteSections ,getSectionsById,deleteSectionMcq,deleteSectionDescripive,getQuizSection,getQuestionsFromSection,startQuiz, changeIsActiveBadge, checkActiveBadge, toggleReverse} from "../controller/sectioncontroller.js"

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
sectionRoute.route("/togglestatus").patch(changeIsActiveBadge)
sectionRoute.route("/checkactivebadge").get(checkActiveBadge)
sectionRoute.route("/togglereverse").patch(toggleReverse)










export default sectionRoute