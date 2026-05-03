import mongoose from "mongoose";
import { DIFFICULTY_LEVELS, TOPIC_TYPES } from "../../constants/course.constants";
import { ContentSchema } from "./_content.schema";
import { getNormalMongoConnection } from "../../helpers/dbHelper";
import { QuestionsSchema } from "./_question.schema";
import { SeoSchema } from "../seo/_seo.schema";


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

    TopicType: {
        type: String,
        enum: Object.values(TOPIC_TYPES),
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

    SEO: {
        type: SeoSchema,
        required: true,
    },

    Order: {
        type: Number,
        required: true,
    },

    Content: {
        type: ContentSchema,
    },

    Question: {
        type: QuestionsSchema,
    },
});

// indexes
TopicSchema.index({ ChapterId: 1, Order: 1 }, { unique: true });
// slug unique within a chapter
TopicSchema.index({ ChapterId: 1, "SEO.Slug": 1 }, { unique: true, sparse: true });

// whenever a topic is fetched only one AIExplanation should be fetched randomly for that topic, this is to optimize the performance of fetching topics as AIExplanations can be large in size and we don't want to fetch all explanations every time we fetch a topic. 
// We can achieve this by using a pre hook on the find and findOne methods of the Topic model.

const connection = getNormalMongoConnection();
const Topic = connection.model("Topic", TopicSchema);

export type TopicDocument = mongoose.InferSchemaType<typeof TopicSchema>;
export default Topic;
