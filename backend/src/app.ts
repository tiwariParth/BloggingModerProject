import express from "express";
import { configureMiddleware } from "./config/middleware";
import { errorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();

configureMiddleware(app);
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
