import mongoose from "mongoose";
import { AIExplanationSchema } from "./_aiExplanation.schema";
import { getNormalMongoConnection } from "../../helpers/dbHelper";

const LessonSchema = new mongoose.Schema({
    CourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    ChapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
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
    },
});

const connection = getNormalMongoConnection();
const Lesson = connection.model("Lesson", LessonSchema);

export default Lesson;
    