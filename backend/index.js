import express from "express";
import cors from "cors";
import Route from "./routes/Route.js";

const port = 8000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(Route);

app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
