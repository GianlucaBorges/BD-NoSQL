import { Request, Response } from "express";
import UsuariosService from "../services/UsuariosService";

export class UsuariosController {
  async createUsuario(req: Request, res: Response): Promise<void> {
    const body = req.body;

    if (
      !body.nome ||
      !body.email ||
      !body.senha ||
      typeof body.nome !== "string" ||
      typeof body.email !== "string" ||
      typeof body.senha !== "string" ||
      body.email.indexOf("@") === -1 ||
      body.email.indexOf(".") === -1
    ) {
      res.status(400).json({ message: "Parâmetros inválidos" });
      return;
    }

    const service = new UsuariosService();

    try {
      await service.createUsuario(body.nome, body.email, body.senha);
      const usuario = await service.login(body.email, body.senha);

      res.json({ message: "Usuário criado com sucesso", usuario: usuario });
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          status: "error",
          message: error.message,
        });
        return;
      }
      res.status(500).json({
        status: "error",
        message: "Erro interno do servidor",
      });
      return;
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const body = req.body;

    if (
      !body.email ||
      !body.senha ||
      typeof body.email !== "string" ||
      typeof body.senha !== "string" ||
      body.email.indexOf("@") === -1 ||
      body.email.indexOf(".") === -1
    ) {
      res.status(400).json({ message: "Parâmetros inválidos" });
      return;
    }

    const service = new UsuariosService();

    try {
      const usuario = await service.login(body.email, body.senha);
      console.log(usuario);
      res.json(usuario);
      return;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Usuário não encontrado") {
          res.status(404).json({
            status: "error",
            message: error.message,
          });
          return;
        } else {
          res.status(500).json({
            status: "error",
            message: error.message,
          });
          return;
        }
      }
      res.status(500).json({
        status: "error",
        message: "Erro interno do servidor",
      });
      return;
    }
  }
}
