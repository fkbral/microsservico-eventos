// Importando o método `readFileSync` do módulo 'fs' para ler o conteúdo dos arquivos.
import { readFileSync } from "fs";

// Importando o método `join` do módulo 'path' para concatenar caminhos.
import { join } from "path";

// Importando o método `open` do módulo 'sqlite' para abrir conexões com o banco de dados SQLite.
import { open } from "sqlite";

// Importando a biblioteca sqlite3.
import sqlite3 from "sqlite3";

// Definindo o caminho do diretório para os arquivos de migração com base no diretório atual.
const migrationDir = join(__dirname, "migrations");

// Função assíncrona para aplicar as migrações do banco de dados.
const applyMigrations = async () => {
  // Abrindo o banco de dados SQLite localizado no caminho especificado usando o driver sqlite3.
  const db = await open({
    filename: "src/db/database.sqlite",
    driver: sqlite3.Database,
  });

  // Lista dos arquivos de migração a serem executados.
  // (Este exemplo contém apenas um, mas mais podem ser adicionados.)
  const migrations = ["001-initial-schema.sql"];

  // Iterando sobre cada arquivo de migração para executá-los.
  for (const migration of migrations) {
    // Lendo o conteúdo SQL do arquivo de migração.
    const migrationScript = readFileSync(join(migrationDir, migration), "utf8");

    // Executando o script de migração no banco de dados.
    await db.exec(migrationScript);
  }

  // Mostrando no console quando todas as migrações forem aplicadas com sucesso.
  console.log("Migrações aplicadas com sucesso.");
};

// Chamando a função para aplicar as migrações.
applyMigrations();
