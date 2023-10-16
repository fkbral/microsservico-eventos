import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/events", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
