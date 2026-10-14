import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectToDB } from "./db.js";
import v1Router from "./routes/v1.routes.js";
const app = express();

app.use(express.json());

app.use('/api/v1', v1Router);

const PORT = process.env.PORT || 3000;

connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
});



