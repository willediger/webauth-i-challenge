const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("./users/users-model.js");

const server = express();

server.use(express.json());
server.use(logger);

server.post("/api/register", async (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  const addedUser = await db.add(user);
  if (addedUser) {
    res.status(201).json(addedUser);
  } else {
    next({
      status: 500,
      message: "The user could not be added."
    });
  }
});

server.post("/api/login", validate, (req, res) => {
  const { username } = req.headers;
  res.status(200).json({ message: `Welcome ${username}!` });
});

server.get("/api/users", validate, async (req, res) => {
  let users = await db.find();
  if (users) {
    res.status(200).json(users);
  } else {
    next({
      status: 500,
      message: "The users could not be retrieved."
    });
  }
});

async function validate(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    //passes object of {username: "..."} which is used in the where clause
    let result = await db.findBy({ username }).first();
    if (result) {
      if (bcrypt.compareSync(password, result.password)) {
        next();
      } else {
        next({
          status: 401,
          message: "Invalid credentials."
        });
      }
    } else {
      next({
        status: 500,
        message: "User does not exist"
      });
    }
  } else {
    next({
      status: 400,
      message: "No credentials provided."
    });
  }
}

server.use(errHandler);

function errHandler(err, req, res, next) {
  res.status(err.status).json({ message: err.message });
}

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
}

module.exports = server;
