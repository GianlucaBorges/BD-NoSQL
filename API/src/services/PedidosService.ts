import * as argon2 from "argon2";
import "dotenv/config";
import prismaCockroach from "../clientCockroach";
import prismaMongo from "../clientMongo";

export default class PedidosService {
  public async createPedido(
    idUsuario: number,
    filmes: {
      idFilme: string;
      quantidade: number;
      preco: number;
    }[]
  ) {
    const usuarioExists = await prismaCockroach.usuarios
      .findFirst({
        where: {
          id: idUsuario,
        },
      })
      .catch(() => {
        throw new Error("Erro ao buscar usuário");
      });

    if (!usuarioExists) {
      throw new Error("Usuário não encontrado");
    }

    const filmesExists = await prismaMongo.filmes
      .findMany({
        where: {
          id: {
            in: filmes.map((filme) => filme.idFilme),
          },
        },
      })
      .catch(() => {
        throw new Error("Erro ao buscar filmes");
      });

    if (filmesExists.length !== filmes.length) {
      throw new Error("Filme não encontrado");
    }

    const isFilmeAlugado = await prismaCockroach.pedido
      .findMany({
        select: {
          itens: {
            select: {
              idFilme: true,
            },
          },
        },
        where: {
          idUsuario,
          itens: {
            some: {
              idFilme: {
                in: filmes.map((filme) => filme.idFilme),
              },
              dataDevolucao: {
                gt: new Date(),
              },
            },
          },
        },
      })
      .catch(() => {
        throw new Error("Erro ao buscar filmes alugados");
      });

    if (isFilmeAlugado.length > 0) {
      const filmesAlugados = isFilmeAlugado.map((pedido) => pedido.itens.map((item) => item.idFilme));
      throw new Error(`IDs dos filmes já alugados: ${filmesAlugados.join(", ")}`);
    }

    const total = filmes.reduce((acc, filme) => {
      return acc + filme.preco * filme.quantidade;
    }, 0);

    await prismaCockroach.$transaction(async (prisma) => {
      const pedido = await prisma.pedido.create({
        data: {
          idUsuario,
          total,
        },
      });

      await prisma.pedido_itens.createMany({
        data: filmes.map((filme) => {
          const hoje = new Date(Date.now());
          hoje.setDate(hoje.getDate() + filme.quantidade);
          return {
            idPedido: pedido.id,
            idFilme: filme.idFilme,
            quantidade: filme.quantidade,
            dataDevolucao: hoje,
            preco: filme.preco,
          };
        }),
        skipDuplicates: true,
      });
    });
  }

  public async getPedidosByUser(idUsuario: number) {
    try {
      // Check if the user exists
      const usuarioExists = await prismaCockroach.usuarios.findFirst({
        where: {
          id: idUsuario,
        },
      });

      if (!usuarioExists) {
        throw new Error("Usuário não encontrado");
      }

      // Fetch all pedidos for the user, including associated items
      const pedidos = await prismaCockroach.pedido.findMany({
        where: {
          idUsuario,
        },
        select: {
          id: true,
          total: true,
          itens: {
            select: {
              idFilme: true,
              quantidade: true,
              preco: true,
              dataDevolucao: true,
              dataPedido: true,
            },
          },
        },
        // orderBy: {
        //   itens:{

        //   } // Orders by the most recent first
        // },
      });

      // Format the response
      return pedidos.map((pedido) => ({
        idPedido: pedido.id,
        total: pedido.total,
        filmes: pedido.itens.map((item) => ({
          idFilme: item.idFilme,
          quantidade: item.quantidade,
          preco: item.preco,
          dataDevolucao: item.dataDevolucao,
          dataPedido: item.dataPedido,
        })),
      }));
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      throw new Error("Erro ao buscar pedidos");
    }
  }
}
