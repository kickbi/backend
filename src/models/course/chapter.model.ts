import mongoose from "mongoose";
import { getNormalMongoConnection } from "../../helpers/dbHelper";
import { AIExplanationSchema } from "./_aiExplanation.schema";

const ChapterSchema = new mongoose.Schema({
    CourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    Title: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
    },
    AIExplanations: {
        type: [AIExplanationSchema],
        default: [],
    },
    Order: {
        type: Number,
        required: true,
    }
})

const connection = getNormalMongoConnection();
const Chapter = connection.model("Chapter", ChapterSchema);

export default Chapter;