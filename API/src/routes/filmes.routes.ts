import { Router } from "express";
import { FilmesController } from "../controller/FilmesController";

const filmesRouter = Router();
const filmesController = new FilmesController();

filmesRouter.get("/paginate", [], filmesController.getFilmes);
filmesRouter.get("/paginate/:titulo", [], filmesController.getFilmes);
filmesRouter.get("/:id", [], filmesController.getFilmeById);

export default filmesRouter;
