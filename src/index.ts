import http from "node:http";
import url from "node:url";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./controllers/usersController";
import { validateUUID } from "./utils/validateUUID";

const PORT = process.env.PORT || 3003;

const server = http.createServer(async (req, res) => {
  // get Users
  if (req.url === "/api/users" && req.method === "GET") {
    getAllUsers(req, res);
  }
  // get single User
  else if (req.url?.substring(0, 10) === "/api/users" && req.method === "GET") {
    getUserById(req, res);
  }
  // create User
  else if (req.url === "/api/users" && req.method === "POST") {
    createUser(req, res);
  }
  // update User
  else if (req.url?.substring(0, 10) === "/api/users" && req.method === "PUT") {
    updateUser(req, res);
  }
  // delete user
  else if (
    req.url?.substring(0, 10) === "/api/users" &&
    req.method === "DELETE"
  ) {
    deleteUser(req, res);
  }
  // default error
  else {
    res.writeHead(404, "NOT FOUND", {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ message: "NOT FOUND" }));
  }
  req.on("error", () => {
    res.writeHead(500, "SERVER ERROR");
    res.end();
  });
});

server.listen(PORT, () => {
  console.log("listening on port 3003");
});
