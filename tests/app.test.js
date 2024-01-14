const request = require("supertest");
const { app } = require("../app.js"); // Upewnij się, że ścieżka do pliku app.js jest poprawna.

it("works", async () => {
  const response = await request(app).get("/");
  expect(response.status).toEqual(200);
  expect(response.header["content-type"]).toEqual(
    "application/json; charset=utf-8"
  );
});

it("works with creating a todo", async () => {
  const response = await request(app).post("/");
  expect(response.status).toEqual(400);
});
it("handles pages that are not found", async () => {
  const response = await request(app).get("/whatever");
  expect(response.status).toEqual(404);
  expect(response.text).toEqual("Not found");
});
