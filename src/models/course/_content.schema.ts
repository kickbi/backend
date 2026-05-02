import mongoose from "mongoose";
import { ASSET_TYPES, DIFFICULTY_LEVELS, QUESTION_TYPES } from "../../constants/course.constants";



const ExampleSchema = new mongoose.Schema({
    DifficultyLevel: {
        type: String,
        enum: Object.values(DIFFICULTY_LEVELS),
    },
    ExampleContent: {
        type: String,
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


const HintSchema = new mongoose.Schema({
    HintContent: {
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
    AIExplanationVersionIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "AIExplanation",
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
    Assets: {
        type: [AssetsSchema],
        default: [],
    }
}, {
    _id: false,
});



// RawContent Placeholders
// [EXAMPLE:EXAMPLE_NAME]
// [HINT:HINT_NAME]
// [ASSET:ASSET_NAME]