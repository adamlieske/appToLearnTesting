const request = require("supertest");

const todo = require("../todo");
let req;
let res;

function expectStatus(status) {
  if (status === 200) {
    return;
  }
  expect(res.status).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(status);
}
function expectResponse(json) {
  expect(res.json).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenCalledWith(json);
}

beforeEach(() => {
  req = {};
  res = {
    json: jest.fn(),
    status: jest.fn(),
  };
});
describe("list", () => {
  it("works", () => {
    todo.list(req, res);
    const todos = todo.getTodos();
    expectStatus(200);
    expectResponse(todos);
  });
});

describe("create", () => {
  it("works", () => {
    const name = "Supper";
    const { length } = todo.getTodos();
    req.body = { name: "Supper" };
    todo.create(req, res);
    const todos = todo.getTodos();
    expectStatus(200);
    expectResponse(todos[todos.length - 1]);
    expect(todos).toHaveLength(length + 1);
    expect(todos[todos.length - 1]).toMatchObject({
      name,
      done: false,
    });
    expect(new Set(todos.map((todo) => todo.id)).size).toEqual(todos.length);
  });

  it("handle missing body", () => {
    todo.create(req, res);
    expectStatus(400);

    expectResponse({ error: "Name is missing" });
  });

  it("handle missing name in the body", () => {
    req.body = {};
    todo.create(req, res);
    expectStatus(400);

    expectResponse({ error: "Name is missing" });
  });

  it("handle and empty name", () => {
    req.body = { name: "" };
    todo.create(req, res);
    expectStatus(400);

    expectResponse({
      error: "Name should not be empty",
    });
  });

  it("handle and empty name (after trimming)", () => {
    req.body = { name: "   " };
    todo.create(req, res);
    expectStatus(400);

    expectResponse({
      error: "Name should not be empty",
    });
  });

  it("handles wrong name type", () => {
    req.body = { name: 42 };
    todo.create(req, res);
    expectStatus(400);

    expectResponse({ error: "Name should be a string" });
  });
});
describe("change", () => {});
describe("delete", () => {});
describe("toggle", () => {});
