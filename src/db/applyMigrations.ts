import { readFileSync } from "fs";
import { join } from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const migrationDir = join(__dirname, "migrations");

const applyMigrations = async () => {
  const db = await open({
    filename: "src/db/database.sqlite",
    driver: sqlite3.Database,
  });

  const migrations = ["001-initial-schema.sql"];

  for (const migration of migrations) {
    const migrationScript = readFileSync(join(migrationDir, migration), "utf8");
    await db.exec(migrationScript);
  }

  console.log("Migrations applied successfully.");
};

applyMigrations();
