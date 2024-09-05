import { Question } from "../models/questionsmodel.js";

const questionPost = async (req, res) => {
    const { category, question, option1, option2, option3, option4, score, correctAns } = req.body
    try {
        const result = await Question.create({
            category, question, option1, option2, option3, option4, score, correctAns
        })
        res.status(200).json({ message: "Questions created successfully", data: result })


    } catch (error) {
        res.status(400).json({ message: `Internal server error due to ${error}` })
    }
}

export {
    questionPost
}