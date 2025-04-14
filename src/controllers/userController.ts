import { Request, Response } from "express";
import User from "../models/user";
import { generateToken } from "../services/JWTService";

export const postLOGIN = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email nulo" });
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({
      error: "Usuário não está no banco de dados, por-favor registre-o",
    });
  }

  const token = generateToken({
    id: user.getDataValue("id"),
    email: user.getDataValue("email"),
  });

  res.json({ token });
};

export const postUSER = async (req: Request, res: Response) => {
  const { name, email, age } = req.body;

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
};

export const getUSERS = async (req: Request, res: Response) => {
  const users = await User.findAll();

  res.json(users);
};

export const getUSERID = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ error: "Usuário não cadastrado" });
  }

  res.json(user);
};

export const putUSER = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ error: "ID de usuário não existente" });
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
};

export const deleteUSER = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ error: "ID de usuário não existente" });
  }

  await user.destroy();

  res.status(204).json({ message: "Usuário removido" });
};
