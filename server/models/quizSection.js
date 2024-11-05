import mongoose, { Schema } from "mongoose";
const QuizSectionSchema= new Schema({
    sectionId: {
        type: Schema.Types.ObjectId,
        ref: "Section"
    },
    questionType:{
        type:"String"
    },
    isActive: {
        type: Boolean,
        default: false
    },
    startTime: {
        type: Date,
    }
})
export const QuizSection = mongoose.model("QuizSection",QuizSectionSchema);