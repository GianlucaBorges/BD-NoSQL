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
      const filmesAlugados = isFilmeAlugado.map((pedido) =>
        pedido.itens.map((item) => item.idFilme)
      );
      throw new Error(
        `IDs dos filmes já alugados: ${filmesAlugados.join(", ")}`
      );
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

  public async getPedidosUsuario(idUsuario: number) {
    const pedidos = await prismaCockroach.pedido
      .findMany({
        where: {
          idUsuario,
        },
        include: {
          itens: {
            select: {
              preco: true,
              dataPedido: true,
              dataDevolucao: true,
              quantidade: true,
              idFilme: true,
            },
            orderBy: {
              dataPedido: "desc",
            },
          },
        },
      })
      .catch(() => {
        throw new Error("Erro ao buscar pedidos");
      });

    if (pedidos.length === 0) {
      return [];
    }

    const pedidosFormatados = pedidos.map((pedido) => {
      const itens = pedido.itens.map((item) => {
        return {
          idFilme: item.idFilme,
          preco: item.preco * item.quantidade,
          dataPedido: item.dataPedido,
          dataDevolucao: item.dataDevolucao,
        };
      });

      return {
        id: pedido.id,
        total: pedido.total,
        itens,
      };
    });

    const filmes = await prismaMongo.filmes
      .findMany({
        select: {
          id: true,
          titulo: true,
        },
        where: {
          id: {
            in: pedidosFormatados.flatMap((pedido) =>
              pedido.itens.map((item) => item.idFilme)
            ),
          },
        },
      })
      .catch(() => {
        throw new Error("Erro ao buscar filmes");
      });

    console.log(filmes);

    if (filmes.length === 0) {
      throw new Error("Filmes não encontrados");
    }

    const res = pedidosFormatados.map((pedido) => {
      const itens = pedido.itens.map((item) => {
        const filme = filmes.find((filme) => filme.id === item.idFilme);
        return {
          ...item,
          titulo: filme!.titulo,
        };
      });

      return {
        ...pedido,
        itens,
      };
    });

    return res;
  }
}
