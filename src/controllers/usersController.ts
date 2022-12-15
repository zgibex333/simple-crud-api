import { User } from "../models/User";
import { USERS_PATH_WITH_ID } from "../utils/patterns";
import { Req, Res } from "../types";
import { getReqBody } from "../utils/getReqBody";

export const getAllUsers = async (req: Req, res: Res) => {
  try {
    const users = await User.allUsers();
    res.writeHead(200, "GET USERS - OK", {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(users));
  } catch {
    res.writeHead(500, "SERVER ERROR");
    res.end();
  }
};

export const getUserById = async (req: Req, res: Res) => {
  try {
    const isValid = USERS_PATH_WITH_ID.test(req.url!);
    if (!isValid) {
      res.writeHead(400, "NOT VALID USER_ID");
      res.end();
    } else {
      const id = req.url?.split("/")[3]!;
      const user = await User.getUserById(id);
      if (!user) {
        res.writeHead(404, "USER DOESNT EXIST");
        res.end();
      } else {
        res.writeHead(200, "GET USER_BY_ID - OK");
        res.end(JSON.stringify(user));
      }
    }
  } catch {
    res.writeHead(500, "SERVER ERROR");
    res.end();
  }
};

export const createUser = async (req: Req, res: Res) => {
  try {
    const body = await getReqBody(req);
    if (!body) {
      res.writeHead(400, "ALL FIELDS ARE REQUIRED");
      res.end();
    }
    const { username, age, hobbies } = JSON.parse(body);
    if (
      age &&
      username &&
      Array.isArray(hobbies) &&
      hobbies.length &&
      hobbies.every((el) => typeof el === "string")
    ) {
      const newUser = await User.create({
        age,
        hobbies,
        username,
      });
      res.writeHead(200, "POST USER_CREATE - OK");
      res.end(JSON.stringify(newUser));
    } else {
      res.writeHead(400, "ALL FIELDS ARE REQUIRED");
      res.end();
    }
  } catch {
    res.writeHead(500, "SERVER ERROR");
    res.end();
  }
};

export const updateUser = async (req: Req, res: Res) => {
  try {
    const isValid = USERS_PATH_WITH_ID.test(req.url!);
    if (!isValid) {
      res.writeHead(400, "NOT VALID USER_ID");
      res.end();
    } else {
      const id = req.url?.split("/")[3]!;
      const user = await User.getUserById(id);
      if (!user) {
        res.writeHead(404, "USER DOESNT EXIST");
        res.end();
      } else {
        const body = await getReqBody(req);
        const { username, age, hobbies } = JSON.parse(body);
        const userData = {
          username: username ?? user.username,
          age: age ?? user.age,
          hobbies: hobbies ?? user.hobbies,
        };
        const updatedUser = await User.updateExisting(id, userData);
        res.writeHead(200, "UPDATE USER_BY_ID - OK");
        res.end(JSON.stringify(updatedUser));
      }
    }
  } catch {
    res.writeHead(500, "SERVER ERROR");
    res.end();
  }
};

export const deleteUser = async (req: Req, res: Res) => {
  try {
    const isValid = USERS_PATH_WITH_ID.test(req.url!);
    if (!isValid) {
      res.writeHead(400, "NOT VALID USER_ID");
      res.end();
    } else {
      const id = req.url?.split("/")[3]!;
      const user = await User.getUserById(id);
      if (!user) {
        res.writeHead(404, "USER DOESNT EXIST");
        res.end();
      } else {
        await User.deleteExisting(id);
        res.writeHead(200, "DELETE USER_BY_ID - OK");
        res.end(JSON.stringify({ id }));
      }
    }
  } catch {
    res.writeHead(500, "SERVER ERROR");
    res.end();
  }
};
