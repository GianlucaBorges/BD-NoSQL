import { Request, Response } from "express";
import CarrinhosService from "../services/CarrinhosService";
import express from "express";

export class CarrinhosController {
  async getCarrinho(req: Request, res: Response): Promise<void> {
    const key = req.query.key;
    console.log(`get ${key}`);
    if (!key) {
      res.status(400).json({ message: "Parâmetros inválidos" });
      return;
    }

    try {
      const carrinho = await CarrinhosService.getKey(key.toString());

      res.json(carrinho);

      return;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Nenhum carrinho encontrado") {
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
  async setCarrinho(req: Request, res: Response): Promise<void> {
    const body = req.body;
    const { carrinhoJson, key } = body; // Destructure the variables
    console.log(`set ${key}`);

    if (!carrinhoJson || !key) {
      res.status(400).json({ message: "Parâmetros inválidos" });
      return;
    }

    try {
      const carrinho = await CarrinhosService.setKey(key, carrinhoJson);

      res.json(carrinho);
      return;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Nenhum carrinho encontrado") {
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
