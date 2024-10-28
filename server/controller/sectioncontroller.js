import { Section } from "../models/sectionmodel.js";

const sectionPost = async (req, res) => {
    const { sectionName, date, questionType } = req.body;
    try {
        const newSection = await Section.create({
            sectionName, date, questionType, Questions: []
        })
        res.status(200).json({ message: "Sections created successfully", data: newSection })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", err: error.message })
    }
}

const questionsSection = async (req, res) => {
    const { sectionId } = req.params;
    const { question, answer, mark } = req.body;
    console.log(sectionId)
    try {
        const result = await Section.findByIdAndUpdate(sectionId, {
            $push: {
                Questions: [{
                    question: req.body.question,
                    answer: req.body.answer,
                    mark: req.body.mark,
                    questionCategory: req.body.questionCategory
                }]
            }
        }, { new: true })

        res.status(200).json({ message: "Question added successfully", data: result })
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", err: error.message })
    }
}

const getSections = async (req, res) => {
    try {
        const sections = await Section.find();
        res.status(200).json({ message: "Sections retrieved successfully", data: sections })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", err: error.message })
    }
}

export { sectionPost, questionsSection, getSections }