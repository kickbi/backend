import mongoose from "mongoose";
import { getNormalMongoConnection, setNormalMongoConnection } from "../helpers/dbHelper";

export async function connectDB() {
    if (getNormalMongoConnection()) {
        console.info("Existing MongoDB connection found, skipping creation...");
        return;
    }

    const uri = process.env.DB_URL;
    if (!uri) {
        return Promise.reject(new Error("DB_URL environment variable is not set"));
    }

    const options: mongoose.ConnectOptions = {};

    if (process.env.DB_USER && process.env.DB_PASS) {
        options.auth = {
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
        };
    }

    if (process.env.MONGO_PROXY_HOST) {
        options.proxyHost = process.env.MONGO_PROXY_HOST;
        options.proxyPort = process.env.MONGO_PROXY_PORT
            ? parseInt(process.env.MONGO_PROXY_PORT, 10)
            : 1080;

        if (process.env.MONGO_PROXY_USER) options.proxyUsername = process.env.MONGO_PROXY_USER;
        if (process.env.MONGO_PROXY_PASS) options.proxyPassword = process.env.MONGO_PROXY_PASS;
    }

    const connection = await mongoose.connect(uri, options);
    setNormalMongoConnection(connection.connection);
}
