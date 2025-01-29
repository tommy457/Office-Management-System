import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errors.middleware";
import routes from "./routes";
import pageNotFound from "./middlewares/page-not-found.middleware";
import cors from "cors";


dotenv.config();

const app = express();
const port: number = parseInt(process.env.PORT as string, 10) || 5000;
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Kuma-Revision"],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 600,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("<h1>API is Live</h1>");
});

app.use(routes);

app.use(pageNotFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;