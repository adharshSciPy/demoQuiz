import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
    question: {
        type: String
    },
    option1: {
        type: String
    },
    option2: {
        type: String
    },
    option3: {
        type: String
    },
    option4: {
        type: String
    },
    correctAns: {
        type: String
    }

})

export const Question = mongoose.model("questions", questionSchema)