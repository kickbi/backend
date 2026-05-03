import mongoose from "mongoose";
import { DIFFICULTY_LEVELS, LANGUAGES_SUPPORTED } from "../../constants/course.constants";
import { getNormalMongoConnection } from "../../helpers/dbHelper";
import { SeoSchema } from "../seo/_seo.schema";

const CourseSchema = new mongoose.Schema({
    SubjectIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Subject",
        required: true,
    },
    Thumbnail: {
        type: String,
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
    DifficultyLevel: {
        type: String,
        enum: Object.values(DIFFICULTY_LEVELS),
        required: true,
    },
    LanguageSupported: {
        type: String,
        enum: Object.values(LANGUAGES_SUPPORTED),
        required: true,
    },
    Tags: {
        type: [String],
        default: [],
    },
    ChaptersCount: {
        type: Number,
        default: 0,
    },
    TopicsCount: {
        type: Number,
        default: 0,
    },
    IsPublished: {
        type: Boolean,
        default: false,
    },
    PublishedAt: {
        type: Date,
    },
    SEO: {
        type: SeoSchema,
        required: true,
    },
});

// indexes
CourseSchema.index({ Title: 1 }, { unique: true });
CourseSchema.index({ SubjectIds: 1 });
CourseSchema.index({ "SEO.Slug": 1 }, { unique: true, sparse: true });

const connection = getNormalMongoConnection();
const Course = connection.model("Course", CourseSchema);

export type CourseDocument = mongoose.InferSchemaType<typeof CourseSchema>;
export default Course;