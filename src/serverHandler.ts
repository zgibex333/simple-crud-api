import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./controllers/usersController";
import { Req, Res, UserType } from "./types";
import { getRequestBody } from "./utils/getRequestBody";
import { logRequestAndPid } from "./utils/logger";
import { MESSAGES } from "./utils/messages";

function isPayloadType(o: any): o is Omit<UserType, "id"> {
  return (
    "username" in o &&
    "hobbies" in o &&
    "age" in o &&
    typeof o["age"] === "number" &&
    typeof o["username"] === "string" &&
    !!o["username"].length &&
    Array.isArray(o["hobbies"]) &&
    ((o["hobbies"].length &&
      o["hobbies"].every((el) => typeof el === "string")) ||
      !o["hobbies"].length)
  );
}

export const serverHandler = async (req: Req, res: Res) => {
  try {
    logRequestAndPid(req);
    res.setHeader("Content-Type", "application/json");
    const body = await getRequestBody(req);
    if (body === null) {
      res.writeHead(MESSAGES.JSON_ERROR.code, MESSAGES.JSON_ERROR.status);
      res.end(MESSAGES.JSON_ERROR.status);
      return;
    }
    const payload = JSON.parse(body);

    if (req.url === "/api/users" && req.method === "GET") {
      getAllUsers(req, res);
      return;
    }

    if (req.url?.substring(0, 10) === "/api/users" && req.method === "PUT") {
      if (isPayloadType(payload)) {
        updateUser(req, res, payload);
      } else {
        res.writeHead(
          MESSAGES.ALL_FIELDS_REQUIRED.code,
          MESSAGES.ALL_FIELDS_REQUIRED.status
        );
        res.end(MESSAGES.ALL_FIELDS_REQUIRED.status);
      }
      return;
    }

    if (req.url === "/api/users" && req.method === "POST") {
      if (isPayloadType(payload)) {
        createUser(req, res, payload);
      } else {
        res.writeHead(
          MESSAGES.ALL_FIELDS_REQUIRED.code,
          MESSAGES.ALL_FIELDS_REQUIRED.status
        );
        res.end(MESSAGES.ALL_FIELDS_REQUIRED.status);
      }
      return;
    }

    if (req.url?.substring(0, 10) === "/api/users" && req.method === "DELETE") {
      deleteUser(req, res);
      return;
    }

    if (req.url?.substring(0, 10) === "/api/users" && req.method === "GET") {
      getUserById(req, res);
      return;
    }

    res.writeHead(MESSAGES.DOESNT_EXIST.code, MESSAGES.DOESNT_EXIST.status);
    res.end(JSON.stringify({ message: "PATH NOT FOUND" }));
  } catch {
    res.writeHead(MESSAGES.SERVER_ERROR.code, MESSAGES.SERVER_ERROR.status);
    res.end(MESSAGES.SERVER_ERROR.status);
  }
  req.on("error", () => {
    res.writeHead(MESSAGES.SERVER_ERROR.code, MESSAGES.SERVER_ERROR.status);
    res.end(MESSAGES.SERVER_ERROR.status);
  });
};
