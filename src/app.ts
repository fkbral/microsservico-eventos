// Importação dos módulos necessários
import "reflect-metadata";
import "./dependency_injection";
import express from "express"; // Framework web para criar a aplicação
import dotenv from "dotenv"; // Módulo para carregar variáveis de ambiente
import cors, { CorsOptions } from "cors"; // Middleware para habilitar CORS

import eventRoutes from "./routes/eventRoutes"; // Rotas para os eventos

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria uma nova instância do express
const app = express();

// Habilita o express para tratar requisições com corpo no formato urlencoded
app.use(express.urlencoded({ extended: false }));

// Habilita o express para tratar requisições com corpo em JSON
app.use(express.json());

// Define a porta padrão ou a porta definida no arquivo .env
const PORT = process.env.PORT || 3000;

const ALLOWED_ORIGIN = "http://localhost:4000";

const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin) {
      // Se não há cabeçalho de origem, rejeitamos a requisição
      callback(new Error("Origin header missing or undefined"));
      return;
    }

    if (origin === ALLOWED_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Usa as rotas definidas em eventRoutes para todas as requisições que começam com "/events"
app.use("/events", eventRoutes);

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
