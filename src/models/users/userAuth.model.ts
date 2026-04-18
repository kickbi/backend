import mongoose from "mongoose";
import { USER_AUTH_PROVIDERS } from "../../constants/user.constants";
import { getNormalMongoConnection } from "../../helpers/dbHelper";
import { IUserAuth } from "../../interface/user.interface";

const UserAuthSchema = new mongoose.Schema<IUserAuth>({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    AuthProvider: {
        type: String,
        required: true,
        enum: Object.values(USER_AUTH_PROVIDERS),
    },
    PasswordHash: {
        type: String,
    },
    PasswordSalt: {
        type: String,
    },
}, {
    timestamps: true,
});

// indexes
UserAuthSchema.index({ Email: 1, AuthProvider: 1 }, { unique: true });

const connection = getNormalMongoConnection();
const UserAuth = connection.model("UserAuth", UserAuthSchema);
export default UserAuth;