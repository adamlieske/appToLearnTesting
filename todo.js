const { respondWithError, respondNotFound } = require("./helpers");

let id = 1;

function getId() {
  const currentId = id;
  id += 1;
  return currentId;
}

function createTodo(name, id = getId(), done = false) {
  return { id, name, done };
}

function verifyName(req, res) {
  if (!req.body || !req.body.hasOwnProperty("name")) {
    return respondWithError(res, "Name is missing");
  }
  let { name } = req.body;
  if (typeof name !== "string") {
    return respondWithError(res, "Name should be a string");
  }
  name = name.trim();
  if (name === "") {
    return respondWithError(res, "Name should not be empty");
  }
  return { name };
}

const todos = [createTodo("Dinner"), createTodo("Dinner")];

function addTodo(todo) {
  todos.push(todo);
}
function findTodo(id) {
  const numberId = Number(id);
  return todos.find((todo) => todo.id === numberId);
}

exports.getTodos = () => todos;
exports.createTodo = createTodo;
exports.addTodo = addTodo;
exports.createTodo = createTodo;
exports.list = (req, res) => {
  res.json(todos);
};

exports.create = (req, res) => {
  const cleanName = verifyName(req, res);
  if (!cleanName) {
    return;
  }
  const todo = createTodo(cleanName.name);
  addTodo(todo);
  res.json(todo);
};

exports.change = (req, res) => {
  const cleanName = verifyName(req, res);
  if (!cleanName) {
    return;
  }
  const todo = findTodo(req.params.id);

  if (typeof todo === "undefined") {
    return respondNotFound(res);
  }
  todo.name = cleanName.name;
  res.json(todo);
};

exports.delete = (req, res) => {
  const todo = findTodo(req.params.id);

  if (typeof todo === "undefined") {
    return respondNotFound(res);
  }
  todos.splice(todos.indexOf(todo), 1);
  res.json(todo);
};

exports.toggle = (req, res) => {
  const todo = findTodo(req.params.id);

  if (typeof todo === "undefined") {
    return respondNotFound(res);
  }
  todo.done = !todo.done;
  res.json(todo);
};
