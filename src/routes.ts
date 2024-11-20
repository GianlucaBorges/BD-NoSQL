import { Router } from "express";
import filmesRouter from "./routes/filmes.routes";

const router = Router();

router.use("/filmes", filmesRouter);

export default router;
