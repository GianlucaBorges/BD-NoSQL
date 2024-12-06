import { Router } from "express";
import { PedidosController } from "../controller/PedidosController";
import isAuthenticated from "../middlewares/isAuthenticated";

const pedidosRouter = Router();
const pedidosController = new PedidosController();

pedidosRouter.post(
  "/create",
  [isAuthenticated],
  pedidosController.createPedido
);
pedidosRouter.get("", [isAuthenticated], pedidosController.getPedidosUsuario);

export default pedidosRouter;
