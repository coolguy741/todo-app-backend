const { Todo } = require("../models/todo");
const auth = require("../middleware/auth");
const express = require("express");
const Joi = require("joi");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find().sort({ date: -1 });
    const filteredTodos = todos.filter((todo) => todo.uid == req.user._id);
    res.send(filteredTodos);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  // deleteOne()
  // deleteMany()
  // findByIDAndDelete()
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send("Todo not found");

    if (req.user._id != todo.uid)
      return res.status(401).send("Todo delete failed. Not authorized");

    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    res.send(deletedTodo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.post("/", auth, async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(200).required(),
    author: Joi.string().min(3).max(30),
    uid: Joi.string(),
    isComplete: Joi.boolean(),
    date: Joi.date(),
  }).options({ abortEarly: false });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, author, isComplete, date, uid } = req.body;

  let todo = new Todo({
    name,
    author,
    isComplete,
    date,
    uid,
  });

  // todo.save().then(todo => {
  //     res.send(todo)
  // }).catch(error => {
  //     console.log(error.message)
  // })

  try {
    todo = await todo.save();
    res.send(todo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(200).required(),
    author: Joi.string().min(3).max(30),
    uid: Joi.string(),
    isComplete: Joi.boolean(),
    date: Joi.date(),
  }).options({ abortEarly: false });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send("ToDo not found");

    if (req.user._id !== todo.uid)
      return res.status(401).send("Todo update failed. Not authorized");

    const { name, author, isComplete, date, uid } = req.body;

    const todos = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        name,
        author,
        isComplete,
        date,
        uid,
      },
      { new: true }
    );
    res.send(todos);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send("Todo not found");

    if (req.user._id != todo.uid)
      return res.status(401).send("Todo check update failed. Not authorized");

    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        isComplete: !todo.isComplete,
      },
      { new: true }
    );
    console.log(updatedTodo);
    res.send(updatedTodo);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message);
  }
});

module.exports = router;
