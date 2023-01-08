import { User } from "../models/User";
import { USERS_PATH_WITH_ID } from "../utils/patterns";
import { Req, Res, UserType } from "../types";
import { MESSAGES } from "../utils/messages";

export const getAllUsers = async (req: Req, res: Res) => {
  try {
    const users = await User.allUsers();
    res.writeHead(MESSAGES.SUCCESS.code, MESSAGES.SUCCESS.status);
    res.end(JSON.stringify(users));
  } catch {
    res.writeHead(MESSAGES.SERVER_ERROR.code, MESSAGES.SERVER_ERROR.status);
    res.end(MESSAGES.SERVER_ERROR.status);
  }
};

export const getUserById = async (req: Req, res: Res) => {
  try {
    const isValid = USERS_PATH_WITH_ID.test(req.url!);
    if (!isValid) {
      res.writeHead(MESSAGES.INVALID_ID.code, MESSAGES.INVALID_ID.status);
      res.end(MESSAGES.INVALID_ID.status);
      return;
    }
    const id = req.url?.split("/")[3]!;
    const user = await User.getUserById(id);
    if (!user) {
      res.writeHead(MESSAGES.DOESNT_EXIST.code, MESSAGES.DOESNT_EXIST.status);
      res.end(MESSAGES.DOESNT_EXIST.status);
      return;
    }
    res.writeHead(MESSAGES.SUCCESS.code, MESSAGES.SUCCESS.status);
    res.end(JSON.stringify(user));
  } catch {
    res.writeHead(MESSAGES.SERVER_ERROR.code, MESSAGES.SERVER_ERROR.status);
    res.end(MESSAGES.SERVER_ERROR.status);
  }
};

export const createUser = async (
  req: Req,
  res: Res,
  payload: Omit<UserType, "id">
) => {
  try {
    const { username, age, hobbies } = payload;
    const newUser = await User.create({
      age,
      hobbies,
      username,
    });
    res.writeHead(MESSAGES.CREATED.code, MESSAGES.CREATED.status);
    res.end(JSON.stringify(newUser));
  } catch {
    res.writeHead(MESSAGES.SERVER_ERROR.code, MESSAGES.SERVER_ERROR.status);
    res.end(MESSAGES.SERVER_ERROR.status);
  }
};

export const updateUser = async (
  req: Req,
  res: Res,
  payload: Omit<UserType, "id">
) => {
  try {
    const isValid = USERS_PATH_WITH_ID.test(req.url!);
    if (!isValid) {
      res.writeHead(MESSAGES.INVALID_ID.code, MESSAGES.INVALID_ID.status);
      res.end(MESSAGES.INVALID_ID.status);
    } else {
      const id = req.url?.split("/")[3]!;
      const user = await User.getUserById(id);
      if (!user) {
        res.writeHead(MESSAGES.DOESNT_EXIST.code, MESSAGES.DOESNT_EXIST.status);
        res.end(MESSAGES.DOESNT_EXIST.status);
      } else {
        const { username, age, hobbies } = payload;
        const userData = {
          username: username,
          age: age,
          hobbies: hobbies,
        };
        const updatedUser = await User.updateExisting(id, userData);
        res.writeHead(MESSAGES.SUCCESS.code, MESSAGES.SUCCESS.status);
        res.end(JSON.stringify(updatedUser));
      }
    }
  } catch {
    res.writeHead(MESSAGES.SERVER_ERROR.code, MESSAGES.SERVER_ERROR.status);
    res.end(MESSAGES.SERVER_ERROR.status);
  }
};

export const deleteUser = async (req: Req, res: Res) => {
  try {
    const isValid = USERS_PATH_WITH_ID.test(req.url!);
    if (!isValid) {
      res.writeHead(MESSAGES.INVALID_ID.code, MESSAGES.INVALID_ID.status);
      res.end(MESSAGES.INVALID_ID.status);
      return;
    }
    const id = req.url?.split("/")[3]!;
    const user = await User.getUserById(id);
    if (!user) {
      res.writeHead(MESSAGES.DOESNT_EXIST.code, MESSAGES.DOESNT_EXIST.status);
      res.end(MESSAGES.DOESNT_EXIST.status);
      return;
    }
    await User.deleteExisting(id);
    res.writeHead(MESSAGES.DELETED.code, MESSAGES.DELETED.status);
    res.end(JSON.stringify({ id }));
  } catch {
    res.writeHead(MESSAGES.SERVER_ERROR.code, MESSAGES.SERVER_ERROR.status);
    res.end();
  }
};
