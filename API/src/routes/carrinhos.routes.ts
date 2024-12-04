import { Router } from "express";
import { CarrinhosController } from "../controller/CarrinhosController";

const carrinhosRouter = Router();
const carrinhosController = new CarrinhosController();

carrinhosRouter.get("/", [], carrinhosController.getCarrinho);
carrinhosRouter.post("/put", [], carrinhosController.setCarrinho);

export default carrinhosRouter;
