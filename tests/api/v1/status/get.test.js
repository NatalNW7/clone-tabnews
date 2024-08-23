import { waitForAllServices } from "tests/orchestrator";

beforeAll(async () => {
  await waitForAllServices;
});

test("GET /status should return 200", async () => {
  const res = await fetch("http://localhost:3000/api/v1/status");
  expect(res.status).toBe(200);

  const body = await res.json();

  expect(body.update_at).toBeDefined();

  const pasrsedUpdateAt = new Date(body.update_at).toISOString();
  expect(body.update_at).toEqual(pasrsedUpdateAt);

  expect(body.dependencies.database.version).toEqual("16.0");
  expect(body.dependencies.database.max_connections).toEqual(100);
  expect(body.dependencies.database.opened_connections).toEqual(1);
});
