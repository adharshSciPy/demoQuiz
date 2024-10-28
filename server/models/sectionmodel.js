import { mongoose, Schema } from "mongoose";

const questionSchema = new Schema({
    question: {
        type: String
    },
    answer: {
        type: String
    },
    mark: {
        type: Number
    },
    questionCategory: {
        type: String
    }
})

const SectionSchema = new Schema({
    sectionName: {
        type: String
    },
    date: {
        type: String
    },
    questionType: {
        type: String
    },
    Questions: [questionSchema]

})


export const Section = mongoose.model("Section", SectionSchema);