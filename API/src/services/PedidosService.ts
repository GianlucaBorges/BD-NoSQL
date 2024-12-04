import * as argon2 from "argon2";
import "dotenv/config";
import prismaCockroach from "src/clientCockroach";
import prismaMongo from "src/clientMongo";

export default class PedidosService {
  public async createUsuario(
    nome: string,
    email: string,
    senha: string
  ): Promise<void> {
    const argonSecret = process.env.ARGON_SECRET;
    const argonSalt = process.env.ARGON_SALT;

    if (!argonSecret || !argonSalt) {
      throw new Error("Secret não configurado");
    }

    const hash = await argon2
      .hash(senha, {
        secret: Buffer.from(argonSecret),
        salt: Buffer.from(argonSalt),
      })
      .catch(() => {
        throw new Error("Erro ao criar hash da senha");
      });

    const usuarioExists = await prismaCockroach.usuarios
      .findFirst({
        where: {
          email,
        },
      })
      .catch(() => {
        throw new Error("Erro ao buscar usuário");
      });

    if (usuarioExists) {
      throw new Error("Usuário já existe");
    }

    await prismaCockroach.usuarios
      .create({
        data: {
          nome,
          email,
          senha: hash,
        },
      })
      .catch(() => {
        throw new Error("Erro ao criar usuário");
      });
  }

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
}
