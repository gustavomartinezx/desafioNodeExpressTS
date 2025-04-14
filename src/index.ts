import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/database";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoutes);

sequelize.sync().then(() => {
  console.log("Banco de dados conectados e sincronizado");
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
});
