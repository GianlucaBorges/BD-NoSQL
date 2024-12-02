import { Router } from "express";
import filmesRouter from "./routes/filmes.routes";
import pedidosRouter from "./routes/pedidos.routes";
import usuariosRouter from "./routes/usuarios.routes";

const router = Router();

router.use("/filmes", filmesRouter);
router.use("/usuarios", usuariosRouter);
router.use("/pedidos", pedidosRouter);

export default router;
