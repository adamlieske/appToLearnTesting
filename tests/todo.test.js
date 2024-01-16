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
  expect(res.send).not.toHaveBeenCalled();
}
function expectTextResponse(text) {
  expect(res.send).toHaveBeenCalledTimes(1);
  expect(res.send).toHaveBeenCalledWith(text);
  expect(res.json).not.toHaveBeenCalled();
}
beforeEach(() => {
  req = {
    params: {},
  };
  res = {
    json: jest.fn(),
    send: jest.fn(),
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
    const name = "Kazik";
    const { length } = todo.getTodos();
    const todos = todo.getTodos();
    req.body = { name };
    todo.create(req, res);

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
describe("change", () => {
  const id = 42;
  const name = "Supper";
  const nextName = "Lunch";

  it("works", () => {
    todo.addTodo(todo.createTodo(name, id));
    const { length } = todo.getTodos();
    req.params.id = id;
    req.body = { name: nextName };
    todo.change(req, res);
    const todos = todo.getTodos();
    const todoFind = todos.find((todo) => todo.id === id);
    expectStatus(200);
    expectResponse(todoFind);
    expect(todos).toHaveLength(length);
    expect(todoFind).toMatchObject({ name: nextName });
  });

  it("handle missing todo", () => {
    req.params.id = "whatever";
    req.body = { name: nextName };
    todo.change(req, res);
    expectStatus(404);
    expectTextResponse("Not found");
  });

  it("handle missing body", () => {
    req.params.id = id;
    todo.change(req, res);
    expectStatus(400);
    expectResponse({ error: "Name is missing" });
  });

  it("handle missing name in the body", () => {
    req.params.id = id;
    req.body = {};
    todo.change(req, res);
    expectStatus(400);

    expectResponse({ error: "Name is missing" });
  });

  it("handle and empty name", () => {
    req.params.id = id;
    req.body = { name: "" };
    todo.change(req, res);
    expectStatus(400);
    expectResponse({
      error: "Name should not be empty",
    });
  });

  it("handle and empty name (after trimming)", () => {
    req.params.id = id;
    req.body = { name: "   " };
    todo.change(req, res);
    expectStatus(400);

    expectResponse({
      error: "Name should not be empty",
    });
  });

  it("handles wrong name type", () => {
    req.params.id = id;
    req.body = { name: 42 };
    todo.change(req, res);
    expectStatus(400);

    expectResponse({ error: "Name should be a string" });
  });
});

describe("delete", () => {
  const id = 42;
  it("works", () => {
    todo.addTodo(todo.createTodo("Supper", id));
    const { length } = todo.getTodos();
    const todoFind = todo.getTodos().find((todo) => todo.id === id);
    req.params.id = id;
    todo.delete(req, res);

    const todos = todo.getTodos();
    expectStatus(200);
    expectResponse(todoFind);
    expect(todos).toHaveLength(length - 1);
    expect(todoFind).toMatchObject({ id });
  });

  it("handle missing todo", () => {
    req.params.id = "whatever";
    todo.delete(req, res);
    expectStatus(404);
    expectTextResponse("Not found");
  });
});
describe("toggle", () => {
  const id = 42;
  it("works", () => {
    todo.addTodo(todo.createTodo("Supper", id));
    const { length } = todo.getTodos();
    req.params.id = id;
    todo.toggle(req, res);

    const todos = todo.getTodos();
    const todoFind = todo.getTodos().find((todo) => todo.id === id);

    expectStatus(200);
    expectResponse(todoFind);
    expect(todos).toHaveLength(length);
    expect(todoFind.done).toEqual(true);
  });

  it("handle missing todo", () => {
    req.params.id = "whatever";
    todo.toggle(req, res);
    expectStatus(404);
    expectTextResponse("Not found");
  });
  it("works with toggling back", () => {
    todo.addTodo(todo.createTodo("Supper", id, true));
    const { length } = todo.getTodos();
    req.params.id = id;
    todo.toggle(req, res);

    const todos = todo.getTodos();
    const todoFind = todo.getTodos().find((todo) => todo.id === id);

    expectStatus(200);
    expectResponse(todoFind);
    expect(todos).toHaveLength(length);
    expect(todoFind.done).toEqual(false);
  });
});
