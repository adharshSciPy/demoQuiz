import { mongoose, Schema } from "mongoose";

const McqSchema = new Schema({
    category: {
        type: String
    },
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
    score: {
        type: Number,
        default: 1
    },
    correctAns: {
        type: String
    }

})

const ShortSchema = new Schema({
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
    timer:{
        hours:{
            type:Number,
            min:0,
            max:23,
            default:0
        },
        minutes:{
            type:Number,
            min:0,
            max:59,
            default:0
        },
        seconds:{
            type:Number,
            min:0,
            max:59,
            default:0
        }
    },
    Questions: [ShortSchema],
    MCQ: [McqSchema],
    isActiveBadge:{
        type:Boolean,
        default:false
    }

})


export const Section = mongoose.model("Section", SectionSchema);