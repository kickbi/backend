import mongoose from "mongoose";
import { LANGUAGES_SUPPORTED } from "../../constants/course.constants";

export const AIExplanationSchema = new mongoose.Schema(
    {
        [LANGUAGES_SUPPORTED.ENGLISH]: {
            type: String,
        },
        [LANGUAGES_SUPPORTED.HINGLISH]: {
            type: String,
        },
    },
    {
        _id: false,
    }
);
