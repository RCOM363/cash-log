import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//middleware
const allowedOrigins = process.env.CORS_ORIGIN.split(",");
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import expenseRouter from "./routes/expense.routes.js";
import incomeRouter from "./routes/income.routes.js";
import categoryRouter from "./routes/category.routes.js";

//routes declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/expenses", expenseRouter);
app.use("/api/v1/incomes", incomeRouter);
app.use("/api/v1/categories", categoryRouter);

export { app };
