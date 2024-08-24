import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.watForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

test("POST /migrations should return 200", async () => {
  const res1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(res1.status).toBe(201);

  const response1Body = await res1.json();
  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);

  const res2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(res2.status).toBe(200);

  const response2Body = await res2.json();
  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
});
