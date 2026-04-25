import mongoose from "mongoose";
import { getNormalMongoConnection } from "../../helpers/dbHelper";
import { USER_GENDER } from "../../constants/user.constants";

const PhoneSchema = new mongoose.Schema(
    {
        Number: {
            type: String,
        },
        CountryCode: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

const UserSchema = new mongoose.Schema(
    {
        FirstName: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
        },
        FullName: {
            type: String,
            required: true,
        },
        DateOfBirth: {
            type: String,
            // format to be "YYYY-MM-DD"
        },
        Gender: {
            type: String,
            enum: Object.values(USER_GENDER),
            default: null,
        },
        Email: {
            type: String,
            required: true,
        },
        Phone: {
            type: PhoneSchema,
            default: null,
        },
        IsEmailVerified: {
            type: Boolean,
            default: false,
        },
        ProfilePicture: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const connection = getNormalMongoConnection();
const User = connection.model("User", UserSchema);
export default User;

UserSchema.index({ Email: 1 }, { unique: true });