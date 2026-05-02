import mongoose from "mongoose";
import { getNormalMongoConnection } from "../../helpers/dbHelper";
import { SeoSchema } from "../seo/_seo.schema";

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
    AIExplanationVersionIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "AIExplanation",
        default: [],
    },
    Order: {
        type: Number,
        required: true,
    },
    TopicsCount: {
        type: Number,
        default: 0,
    },
    SEO: {
        type: SeoSchema,
    },
});

// indexes
ChapterSchema.index({ CourseId: 1, Order: 1 }, { unique: true });
// slug unique within a course
ChapterSchema.index({ CourseId: 1, "SEO.Slug": 1 }, { unique: true, sparse: true });

const connection = getNormalMongoConnection();
const Chapter = connection.model("Chapter", ChapterSchema);

export default Chapter;