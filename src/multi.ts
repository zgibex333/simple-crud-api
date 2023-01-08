// import cluster, { Worker } from "node:cluster";
// import http from "http";
// import os from "os";
// import { Req, Res, UserType } from "./types";
// import { serverHandler } from "./serverHandler";

// let PORT = Number(process.env.PORT) || 4000;
// let currentWorker = 1;

// if (cluster.isPrimary) {
//   const data: UserType[] = [];
//   const workers: Worker[] = [];
//   const redirectHandler = (req: Req, res: Res) => {
//     let data = "";
//     req.on("data", (bodyData) => {
//       data += bodyData.toString();
//     });
//     req.on("end", () => {
//       const request = http.request(
//         { ...req, path: req.url, port: 4000 + currentWorker },
//         (response) => {
//           res.statusCode = response.statusCode as number;
//           res.statusMessage = response.statusMessage as string;
//           res.setHeader("Content-Type", "application/json");
//           response.pipe(res);
//         }
//       );
//       request.write(data);
//       request.end();
//       if (currentWorker === os.cpus().length - 1) {
//         currentWorker = 0;
//       } else {
//         currentWorker++;
//       }
//     });
//     req.on("error", () => {
//       res.writeHead(500, "SERVER ERROR");
//       res.end();
//     });
//   };

//   const server = http.createServer(redirectHandler);
//   server.listen(PORT, () => PORT++);

//   for (let i = 0; i < os.cpus().length - 1; i++) {
//     const worker = cluster.fork({ TASK_PORT: ++PORT });
//     workers.push(worker);
//     worker.send(data);
//     worker.on("message", (data) => {
//       workers.forEach((worker) => {
//         worker.send(data);
//       });
//     });
//   }
// }
// if (cluster.isWorker) {
//   const workerPort = process.env["TASK_PORT"];
//   if (workerPort) {
//     const workerServer = http.createServer(serverHandler);
//     workerServer.listen(+workerPort);
//   }
// }
