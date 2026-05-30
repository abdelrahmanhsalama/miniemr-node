import "dotenv/config";

import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { authRouter } from "./routes/authRouter.js";
import { adminRouter } from "./routes/adminRouter.js";
import { patientsRouter } from "./routes/patientsRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/patients", patientsRouter);

app.use(errorHandler);

app.listen(PORT, (err) => {
  if (err) {
    throw new Error("Error running server");
  }
  console.log(`App running on port ${PORT}`);
});
