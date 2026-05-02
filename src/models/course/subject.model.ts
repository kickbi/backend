import mongoose from "mongoose";
import { getNormalMongoConnection } from "../../helpers/dbHelper";
import { SeoSchema } from "../seo/_seo.schema";

const SubjectModel = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        unique: true,
    },
    Description: {
        type: String,
    },
    Thumbnail: {
        type: String,
    },
    SEO: {
        type: SeoSchema,
    },
});

// sparse so subjects without a slug are not indexed
SubjectModel.index({ "SEO.Slug": 1 }, { unique: true, sparse: true });

const connection = getNormalMongoConnection();
const Subject = connection.model("Subject", SubjectModel);

export default Subject;