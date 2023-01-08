import { Req } from "../types";

export const logRequestAndPid = (req: Req) => {
  console.log(
    `[ METHOD: ${req.method}\t URL: ${req.url} ]\t process pid: [${process.pid}]`
  );
};
