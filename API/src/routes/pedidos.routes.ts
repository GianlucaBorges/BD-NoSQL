import { Router } from "express";
import { PedidosController } from "src/controller/PedidosController";
import isAuthenticated from "src/middlewares/isAuthenticated";

const pedidosRouter = Router();
const pedidosController = new PedidosController();

pedidosRouter.post(
  "/create",
  [isAuthenticated],
  pedidosController.createPedido
);

export default pedidosRouter;
