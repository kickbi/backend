import mongoose from "mongoose";
import { QUESTION_TYPES } from "../../constants/course.constants";

export const QuestionsSchema = new mongoose.Schema({
    Type: {
        type: String,
        enum: Object.values(QUESTION_TYPES),
    },
    Question: {
        type: String,
    },
    Options: {
        type: [String],
    },
    Answer: {
        type: String,
    },
    AnswerDescription: {
        type: String,
    },
    AIExplanationVersionIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "AIExplanation",
        default: [],
    },
}, {
    _id: false,
});