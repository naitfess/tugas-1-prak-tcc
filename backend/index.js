import express from "express";
import path from "path";
import cors from "cors";
import Route from "./routes/Route.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(cors({
  origin: "https://fe-alung-t7-dot-b-01-450713.uc.r.appspot.com/",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"], // Include Authorization header
}));
app.use(express.json());
app.use(Route);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
