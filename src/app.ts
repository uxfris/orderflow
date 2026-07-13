import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";
import response from "./middleware/response.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(morgan("dev"));
app.use(response);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
