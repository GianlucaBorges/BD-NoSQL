import prismaMongo from "../clientMongo";
import { Prisma } from "../../prisma/clientMongo";

interface IFilme {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: {
    id: string;
    ano: number;
    titulo: string;
  }[];
}

function escapeRegex(input: string): string {
  return input.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export default class FilmesService {
  public async getFilmes(
    page: number,
    per_page: number,
    titulo?: string
  ): Promise<IFilme> {
    const limit = per_page;
    const offset = page * limit;

    let findManyOptions: Prisma.filmesFindManyArgs = {
      select: {
        id: true,
        ano: true,
        titulo: true,
        preco: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        titulo: "asc",
      },
    };

    let countOptions: Prisma.filmesCountArgs = {};

    if (titulo) {
      findManyOptions = {
        ...findManyOptions,
        where: {
          titulo: {
            contains: escapeRegex(titulo),
            mode: "insensitive",
          },
        },
      };
      countOptions = {
        where: {
          titulo: {
            contains: escapeRegex(titulo),
            mode: "insensitive",
          },
        },
      };
    }

    const [count, filmes] = await prismaMongo
      .$transaction([
        prismaMongo.filmes.count(countOptions),
        prismaMongo.filmes.findMany(findManyOptions),
      ])
      .catch(() => {
        throw new Error("Erro ao buscar filmes");
      });

    const totalPages = Math.ceil(count / limit);

    if (!filmes) {
      throw new Error("Filmes não encontrados");
    }

    return {
      page: Number(page),
      per_page: limit,
      total: count,
      total_pages: totalPages,
      data: filmes,
    };
  }

  public async getFilmeById(id: string) {
    const filme = await prismaMongo.filmes
      .findUnique({
        select: {
          id: true,
          ano: true,
          classificacoes: true,
          diretores: true,
          duracao: true,
          generos: true,
          titulo: true,
          regiao: true,
          preco: true,
        },
        where: {
          id,
        },
      })
      .catch(() => {
        throw new Error("Erro ao buscar filme");
      });

    if (!filme) {
      throw new Error("Filme não encontrado");
    }

    return filme;
  }
}
