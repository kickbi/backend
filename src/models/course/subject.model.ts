import mongoose from "mongoose";
import { getNormalMongoConnection } from "../../helpers/dbHelper";

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
    }
})

const connection = getNormalMongoConnection();
const Subject = connection.model("Subject", SubjectModel);

export default Subject;