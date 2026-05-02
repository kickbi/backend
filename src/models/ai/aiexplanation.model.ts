import mongoose from "mongoose";
import { LANGUAGES_SUPPORTED } from "../../constants/course.constants";
import { getNormalMongoConnection } from "../../helpers/dbHelper";

const AIExplanationSchema = new mongoose.Schema({
    [LANGUAGES_SUPPORTED.ENGLISH]: {
        type: String,
    },
    [LANGUAGES_SUPPORTED.HINGLISH]: {
        type: String,
    },
});

const connection = getNormalMongoConnection();
const AIExplanation = connection.model("AIExplanation", AIExplanationSchema);

export default AIExplanation;