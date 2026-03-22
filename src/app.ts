import express from "express";
import testRoutes from "./routes/test";
import test1Routes from "./routes/test1";

export const app = express();

app.use(express.json());

app.use(testRoutes);
app.use(test1Routes);
