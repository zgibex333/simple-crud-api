import cluster, { Worker } from "node:cluster";
import os from "os";
import http from "http";
import { redirectClient } from "./client";
import { serverHandler } from "./serverHandler";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

function start() {
  const isMulti = process?.argv[2]?.split("=")[1] === "true";
  const workers: { worker: Worker; pid: number | undefined; port: number }[] =
    [];
  let firstPort = PORT;
  if (isMulti) {
    if (cluster.isPrimary) {
      for (let i = 0; i < os.cpus().length - 1; i++) {
        const worker = cluster.fork({ WORKER_PORT: ++firstPort });
        workers.push({ worker, pid: worker.process.pid, port: firstPort });
        worker.on("exit", () => {
          const deadWorkerIndex = workers.findIndex(
            (item) => item.pid === worker.process.pid
          );
          const deadWorkerPort = workers[deadWorkerIndex].port;
          const newWorker = cluster.fork({
            WORKER_PORT: deadWorkerPort,
          });
          workers[deadWorkerIndex] = {
            worker: newWorker,
            pid: newWorker.process.pid,
            port: deadWorkerPort,
          };
        });
        worker.on("message", (data) => {
          workers.forEach((item) => {
            item.worker.send(data);
          });
        });
      }
      const server = http.createServer((req, res) =>
        redirectClient(req, res, PORT)
      );
      server.listen(PORT, () => {
        console.log(`load balancer server is listening ${PORT} port`);
      });
    }
    if (cluster.isWorker) {
      const { WORKER_PORT } = process.env;
      if (WORKER_PORT) {
        const workerServer = http.createServer(serverHandler);
        workerServer.listen(Number(WORKER_PORT), () => {
          console.log(`worker server is listening ${WORKER_PORT} port`);
        });
      }
    }
  } else {
    const server = http.createServer(serverHandler);
    server.listen(PORT, () => {
      console.log(`server is listening ${PORT} port`);
    });
  }
}

start();
