import { Req } from "../types";

export const getRequestBody = (req: Req): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("error", (err) => {
      reject(err);
    });

    req.on("data", (data) => {
      body += data;
    });

    req.on("end", () => {
      if (typeof body === "string" && !body.length) resolve("{}");
      try {
        JSON.parse(body);
        resolve(body);
      } catch {
        resolve(null);
      }
    });
  });
};
