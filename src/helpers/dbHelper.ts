import mongoose from "mongoose";

let normalMongoConnection: mongoose.Connection | null = null;

export const setNormalMongoConnection = (conn: mongoose.Connection) => {
    normalMongoConnection = conn;
};

export const getNormalMongoConnection = () => {
    return normalMongoConnection;
};