import { Router } from 'express';
import { sectionPost, questionsSection, getSections } from "../controller/sectioncontroller.js"

const sectionRoute = Router();

sectionRoute.route("/createsection").post(sectionPost);
sectionRoute.route("/createquestions/:sectionId").put(questionsSection);
sectionRoute.route("/getsections").get(getSections);


export default sectionRoute