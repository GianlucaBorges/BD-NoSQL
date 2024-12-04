import { Request, Response } from "express";
import FilmesService from "../services/FilmesService";
import { ObjectId } from "mongodb";

function isObjectId(id: string): boolean {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

export class FilmesController {
  async getFilmes(req: Request, res: Response): Promise<void> {
    const query = req.query;
    const params = req.params;

    const service = new FilmesService();

    if (!query.page || !query.per_page) {
      res.status(400).json({ message: "Parâmetros inválidos" });
      return;
    }

    const page = Number(query.page);

    const per_page = Number(query.per_page);

    try {
      const filmes = await service.getFilmes(page, per_page, params.titulo);

      res.json(filmes);
      return;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Filmes não encontrados") {
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

  async getFilmeById(req: Request, res: Response): Promise<void> {
    const params = req.params;

    // id precisa ser uma string
    if (!params.id || !isObjectId(params.id)) {
      res.status(400).json({ message: "Parâmetros inválidos" });
      return;
    }

    const service = new FilmesService();

    try {
      const filme = await service.getFilmeById(params.id);

      res.json(filme);
      return;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Filme não encontrado") {
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
