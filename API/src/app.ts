import express, { Application } from "express";
import routes from "./routes";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(express.json());

app.use(cors());

// Rotas
app.use("/api", routes);

export default app;
