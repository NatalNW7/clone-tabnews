import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(req, res) {
  const dbClient = await database.getNewClient();

  if (req.method === "GET") {
    const pendingMigrations = await migrate(dbClient, true);
    await dbClient.end();

    return res.status(200).json(pendingMigrations);
  }

  if (req.method === "POST") {
    const migratedMigrations = await migrate(dbClient, false);
    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }

    return res.status(200).json(migratedMigrations);
  }

  return req.status(405).end();
}

async function migrate(dbClient, isDryRun) {
  return await migrationRunner({
    dbClient: dbClient,
    dryRun: isDryRun,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pdmigrations",
  });
}
