import { createNormalConnection, setNormalMongoConnection } from "../helpers/dbHelper";

export async function connectDB() {
    const normalConnection = await createNormalConnection();
    setNormalMongoConnection(normalConnection);
    console.log("Normal MongoDB connection established");
}
