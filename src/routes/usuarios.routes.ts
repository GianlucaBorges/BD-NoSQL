import { Router } from "express";
import { UsuariosController } from "../controller/UsuariosController";

const usuariosRouter = Router();
const usuariosController = new UsuariosController();

usuariosRouter.post("/create", [], usuariosController.createUsuario);
usuariosRouter.post("/login", [], usuariosController.login);

export default usuariosRouter;
