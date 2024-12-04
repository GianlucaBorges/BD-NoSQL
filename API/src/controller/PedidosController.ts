import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import PedidosService from "../services/PedidosService";

export class PedidosController {
  async createPedido(req: Request, res: Response): Promise<void> {
    const { filmes } = req.body;

    const authHeader = req.headers.authorization!;

    const [, token] = authHeader.split(" ");

    const jwtSecret = process.env.JWT_SECRET;

    const decodedToken = verify(token, jwtSecret!) as {
      id: number;
      iat: number;
      exp: number;
    };

    if (
      !decodedToken ||
      !filmes ||
      !decodedToken.id ||
      !Array.isArray(filmes) ||
      filmes.length === 0 ||
      filmes.some(
        (filme) =>
          !filme.idFilme ||
          !filme.quantidade ||
          !filme.preco ||
          typeof filme.idFilme !== "string" ||
          filme.idFilme.length !== 24 ||
          typeof filme.quantidade !== "number" ||
          typeof filme.preco !== "number"
      )
    ) {
      res.status(400).json({ message: "Parâmetros inválidos" });
      return;
    }

    const service = new PedidosService();

    try {
      await service.createPedido(decodedToken.id, filmes);

      res.json({ message: "Pedido criado com sucesso" });
      return;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Usuário não encontrado" || error.message === "Filme não encontrado") {
          res.status(404).json({
            status: "error",
            message: error.message,
          });
          return;
        } else if (error.message.includes("IDs dps filmes já alugados")) {
          res.status(400).json({
            status: "error",
            message: error.message,
          });
          return;
        }
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

  async getPedidosUsuario(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization!;

    const [, token] = authHeader.split(" ");

    const jwtSecret = process.env.JWT_SECRET;

    const decodedToken = verify(token, jwtSecret!) as {
      id: number;
      iat: number;
      exp: number;
    };

    if (!decodedToken || !decodedToken.id) {
      res.status(400).json({ message: "Parâmetros inválidos" });
      return;
    }

    const service = new PedidosService();

    try {
      const pedidos = await service.getPedidosUsuario(decodedToken.id);

      res.json(pedidos);
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
}
