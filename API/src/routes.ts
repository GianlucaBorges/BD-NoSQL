import { Router } from "express";
import filmesRouter from "src/routes/filmes.routes";
import pedidosRouter from "src/routes/pedidos.routes";
import usuariosRouter from "src/routes/usuarios.routes";
import carrinhosRouter from "src/routes/carrinhos.routes";

const router = Router();

router.use("/filmes", filmesRouter);
router.use("/usuarios", usuariosRouter);
router.use("/pedidos", pedidosRouter);
router.use("/carrinhos", carrinhosRouter);

export default router;
