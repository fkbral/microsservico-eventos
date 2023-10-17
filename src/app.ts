// Importação dos módulos necessários
import express from "express"; // Framework web para criar a aplicação
import dotenv from "dotenv"; // Módulo para carregar variáveis de ambiente
import cors from "cors"; // Middleware para habilitar CORS
import eventRoutes from "./routes/eventRoutes"; // Rotas para os eventos

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria uma nova instância do express
const app = express();

// Utiliza o middleware CORS para permitir requisições de diferentes origens
app.use(cors());

// Habilita o express para tratar requisições com corpo no formato urlencoded
app.use(express.urlencoded({ extended: false }));

// Habilita o express para tratar requisições com corpo em JSON
app.use(express.json());

// Define a porta padrão ou a porta definida no arquivo .env
const PORT = process.env.PORT || 3000;

// Usa as rotas definidas em eventRoutes para todas as requisições que começam com "/events"
app.use("/events", eventRoutes);

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
