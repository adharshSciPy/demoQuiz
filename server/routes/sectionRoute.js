import { Router } from 'express';
import { sectionPost, questionsSection, getSections, McqSection, deleteSections ,getSectionsById} from "../controller/sectioncontroller.js"

const sectionRoute = Router();

sectionRoute.route("/createsection").post(sectionPost);
sectionRoute.route("/createquestions/:sectionId").put(questionsSection);
sectionRoute.route("/getsections").get(getSections);
sectionRoute.route("/getsectionsbyid/:sectionId").get(getSectionsById);
sectionRoute.route("/mcqsections/:sectionId").put(McqSection);
sectionRoute.route("/deletesection/:sectionId").delete(deleteSections);




export default sectionRoute