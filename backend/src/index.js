import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

const port = process.env.PORT || 6000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
    });

    app.on("error", (err) => {
      console.error("listening error: ", err);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error: ", err);
  });
