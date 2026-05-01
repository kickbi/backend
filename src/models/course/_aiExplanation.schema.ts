import mongoose from "mongoose";
import { DIFFICULTY_LEVELS } from "../../constants/course.constants";
import { LanguageSchema } from "./_language.schema";


export const AIExplanationSchema = new mongoose.Schema({
    DifficultyLevel: {
        type: String,
        enum: Object.values(DIFFICULTY_LEVELS),
    },
    Explanation: {
        type: LanguageSchema,
    },
}, {
    _id: false,
});