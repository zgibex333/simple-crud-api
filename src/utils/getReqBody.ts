import { Req } from "../types";

export const getReqBody = async (req: Req) =>
  new Promise<string>((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => {
        resolve(body);
      });
    } catch (err) {
      reject(err);
    }
  });
