import express from "express";
import dotenv from "dotenv";
import { createBot } from "./bot";
import apiRouter from "./api/routes/routes";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});

// Start Telegram bot (polling)
// NOTE : This is a fire-and-forget operation, the bot will run in the background
// and handle commands as they come in.
// use webhooks for production environments.
createBot(); 