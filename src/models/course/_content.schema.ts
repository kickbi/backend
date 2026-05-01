import mongoose from "mongoose";
import { ASSET_TYPES, DIFFICULTY_LEVELS, QUESTION_TYPES } from "../../constants/course.constants";
import { LanguageSchema } from "./_language.schema";
import { AIExplanationSchema } from "./_aiExplanation.schema";




const ExampleSchema = new mongoose.Schema({
    DifficultyLevel: {
        type: String,
        enum: Object.values(DIFFICULTY_LEVELS),
    },
    Explanation: {
        type: LanguageSchema,
    },
    ExampleName: {
        type: String,
    },
}, {
    _id: false,
});


const AssetsSchema = new mongoose.Schema({
    Type: {
        type: String,
        enum: Object.values(ASSET_TYPES),
    },
    AssetURI: {
        type: String,
    },
    AssetName: {
        type: String,
    },
},{
    _id: false,
});


const QuestionsSchema = new mongoose.Schema({
    Type: {
        type: String,
        enum: Object.values(QUESTION_TYPES),
    },
    Question: {
        type: String,
    },
    Options: {
        type: [String],
    },
    Answer: {
        type: String,
    },
    Explanation: {
        type: LanguageSchema,
    },
}, {
    _id: false,
});

const HintSchema = new mongoose.Schema({
    Hint: {
        type: String,
    },
    HintName: {
        type: String,
    }
}, {
    _id: false,
});



export const ContentSchema = new mongoose.Schema({
    RawContent: {
        type: String,
    },
    AIExplanations: {
        type: [AIExplanationSchema],
        default: [],
    },
    Examples: {
        type: [ExampleSchema],
        default: [],
    },
    Hints: {
        type: [HintSchema],
        default: [],
    },
    CommonMistakes: {
        type: [String],
        default: [],
    },
    Assets: {
        type: [AssetsSchema],
        default: [],
    },
    Questions: {
        type: [QuestionsSchema],
        default: [],
    }
});



// RawContent Placeholders
// [EXAMPLE:EXAMPLE_NAME]
// [HINT:HINT_NAME]
// [ASSET:ASSET_NAME]