import { Req, Res } from "./types";
import http from "http";
import os from "os";
import { MESSAGES } from "./utils/messages";

let currentWorker = 1;

export const redirectClient = (req: Req, res: Res, port: number) => {
  let data = "";
  req.on("data", (bodyData) => {
    data += bodyData.toString();
  });
  req.on("end", () => {
    const request = http.request(
      { ...req, path: req.url, port: port + currentWorker },
      (response) => {
        res.statusCode = response.statusCode as number;
        res.statusMessage = response.statusMessage as string;
        res.setHeader("Content-Type", "application/json");
        response.pipe(res);
      }
    );
    request.write(data);
    request.end();
    if (currentWorker === os.cpus().length - 1) {
      currentWorker = 0;
    } else {
      currentWorker++;
    }
  });
  req.on("error", () => {
    res.writeHead(MESSAGES.SERVER_ERROR.code, MESSAGES.SERVER_ERROR.status);
    res.end(MESSAGES.SERVER_ERROR.status);
  });
};
