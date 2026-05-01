import mongoose from "mongoose";
import { LANGUAGES_SUPPORTED } from "../../constants/course.constants";

export const LanguageSchema = new mongoose.Schema({
    [LANGUAGES_SUPPORTED.ENGLISH]: {
        type: String,
    },
    [LANGUAGES_SUPPORTED.HINGLISH]: {
        type: String,
    },
});
