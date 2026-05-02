import mongoose from "mongoose";
import { DIFFICULTY_LEVELS } from "../../constants/course.constants";
import { ContentSchema } from "./_content.schema";
import { getNormalMongoConnection } from "../../helpers/dbHelper";
import { AIExplanationSchema } from "./_aiExplanation.schema";


const TopicSchema = new mongoose.Schema({
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
    DifficultyLevel: {
        type: String,
        enum: Object.values(DIFFICULTY_LEVELS),
    },
    Keywords: {
        type: [String],
        default: [],
    },
    AIExplanations: {
        type: [AIExplanationSchema],
        default: [],
    },
    Content: {
        type: ContentSchema,
        required: true,
    },
    Order: {
        type: Number,
        required: true,
    },
});

const connection = getNormalMongoConnection();
const Topic = connection.model("Topic", TopicSchema);

export default Topic;
