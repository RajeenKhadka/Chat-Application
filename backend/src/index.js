import express from "express";

const app = express();

//import .env
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;

//import routes
import db from "./lib/conn.js";
import authRoutes from "./routes/auth.route.js";

app.listen(PORT, () => {
  console.log(`${PORT} is active!`);
});

//middleware function that parses incoming JSON payloads from the request body and makes them available in req.body.
app.use(express.json());

app.use("/api/auth", authRoutes);
