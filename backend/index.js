import express from "express";
import cors from "cors";
import Route from "./routes/Route.js";

const port = 5000;
const app = express();
const corsOptions = {
  origin: "*", // Replace with the allowed origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies if needed
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(Route);

app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
