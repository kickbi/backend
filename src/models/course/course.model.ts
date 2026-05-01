import mongoose from "mongoose";
import { DIFFICULTY_LEVELS, LANGUAGES_SUPPORTED } from "../../constants/course.constants";
import { getNormalMongoConnection } from "../../helpers/dbHelper";
import { AIExplanationSchema } from "./_aiExplanation.schema";

const CourseSchema = new mongoose.Schema({
    SubjectIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Subject",
        required: true,
    },
    Thumbnail: {
        type: String,
    },
    Title : {
        type : String,
        required : true,
    }, 
    Description : {
        type : String,
    },
    AIExplanations: {
        type: [AIExplanationSchema],
        default: [],
    },
    DifficultyLevel : {
        type : String,
        enum : Object.values(DIFFICULTY_LEVELS),
        required : true,
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
    IsPublished: {
        type: Boolean,
        default: false,
    },
    PublishedAt: {
        type: Date,
    }
})

const connection = getNormalMongoConnection();
const Course = connection.model("Course", CourseSchema);

export default Course;