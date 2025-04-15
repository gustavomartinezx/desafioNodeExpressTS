import { Request, Response } from "express";
import User from "../models/user";
import { generateToken } from "../services/JWTService";

export const postLOGIN = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name } = req.body;

    if (!email) {
      res.status(400).json({ error: "O campo email é obrigatório" });
      return;
    } else if (!name) {
      res.status(400).json({ error: "O campo name é obrigatório" });
      return;
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({
        error: "Usuário não está no banco de dados, por-favor registre-o",
      });
      return;
    }

    const token = generateToken({
      id: user.getDataValue("id"),
      email: user.getDataValue("email"),
    });

    res.json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const postUSER = async (req: Request, res: Response): Promise<void> => {
  const { name, email, age } = req.body;

  if (!name) {
    res.status(400).json({ error: "O campo name é obrigatorio" });
    return;
  } else if (!email) {
    res.status(400).json({ error: "O campo email é obrigatorio" });
  }

  try {
    const existeEmail = await User.findOne({ where: { email } });
    if (existeEmail) {
      res.status(400).json({ error: "Email já cadastrado" });
      return;
    }

    const user = await User.create({
      name,
      email,
      age,
    });

    res.status(201).json({
      id: user.getDataValue("id"),
      name: user.getDataValue("name"),
      email: user.getDataValue("email"),
    });
    return;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getUSERS = async (req: Request, res: Response): Promise<void> => {
  try {
    const pagina = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (pagina - 1) * limit;

    const { count: total, rows: users } = await User.findAndCountAll({
      limit,
      offset,
    });

    res.json({
      users,
      Paginacao: {
        Total: total,
        Pagina: pagina,
        Limite: limit,
        Paginas_Totais: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

export const getUSERID = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ error: "Usuário não cadastrado" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const putUSER = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ error: "ID de usuário não existente" });
      return;
    }

    if (name) user.setDataValue("name", name);
    if (email) user.setDataValue("email", email);
    if (age !== undefined) user.setDataValue("age", age);

    await user.save();

    res.json({
      id: user.getDataValue("id"),
      name: user.getDataValue("name"),
      email: user.getDataValue("email"),
      age: user.getDataValue("age"),
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const deleteUSER = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ error: "ID de usuário não existente" });
      return;
    }

    await user.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
