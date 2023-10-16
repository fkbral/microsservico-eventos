import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import professionalsRouter from "./routes/professionalsRouter";
import studentsRouter from "./routes/studentsRouter";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h3 style='color: green'>Hello World</h3>");
});

app.use("/students", studentsRouter);
app.use("/professionals", professionalsRouter);

app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});
