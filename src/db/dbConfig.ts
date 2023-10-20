import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initializeDatase = async () => {
  return open({
    filename: "src/db/database.sqlite",
    driver: sqlite3.Database,
  });
};

export default initializeDatase;
