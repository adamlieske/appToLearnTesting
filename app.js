const bodyParser = require("body-parser");
const express = require("express");
const { respondNotFound } = require("./helpers");
const todo = require("./todo");
const app = express();

app.use(bodyParser.json());

app.get("/", todo.list);
app.post("/", todo.create);
app.put("/:id", todo.change);
app.delete("/:id", todo.delete);
app.post("/:id/toggle", todo.toggle);

app.get("*", (req, res) => {
  respondNotFound(res);
});

app.use((err, req, res, next) => {
  res.status(500).send(
    `We have encountered an error and we were notified about instanceof.
      We'll try to fix it as soon as posible`
  );
});

exports.app = app;
