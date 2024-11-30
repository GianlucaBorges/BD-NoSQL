import * as argon2 from "argon2";
import "dotenv/config";
import { sign } from "jsonwebtoken";
import prismaCockroach from "../clientCockroach";

interface IUsuario {
  nome: string;
  email: string;
  token: string;
}

export default class UsuariosService {
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

  public async login(email: string, senha: string): Promise<IUsuario> {
    const usuarios = await prismaCockroach.usuarios
      .findFirst({
        where: {
          email,
        },
      })
      .catch(() => {
        throw new Error("Erro ao buscar usuário");
      });

    if (!usuarios) {
      throw new Error("Login ou senha inválidos");
    }

    const argonSecret = process.env.ARGON_SECRET;

    if (!argonSecret) {
      throw new Error("Secret não configurado");
    }

    const match = await argon2
      .verify(usuarios.senha, senha, {
        secret: Buffer.from(argonSecret),
      })
      .catch(() => {
        throw new Error("Erro ao verificar senha");
      });

    if (!match) {
      throw new Error("Login ou senha inválidos");
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("Secret não configurado");
    }

    const token = sign({}, jwtSecret, {
      expiresIn: "1d",
    });

    return {
      nome: usuarios.nome,
      email: usuarios.email,
      token: `Bearer ${token}`,
    };
  }
}
