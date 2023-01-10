import request from "supertest";
import http from "http";
import { serverHandler } from "../serverHandler";
import { UserType } from "../types";

let server: http.Server;

beforeAll((done) => {
  server = http.createServer(serverHandler).listen(3002, done);
});

const userData = {
  username: "Chicago",
  age: 1997,
  hobbies: ["hiking"],
};
describe("Data Size", () => {
  const usersIds: string[] = [];
  it("several POST /api/users increase data size", async () => {
    for (let i = 1; i < 10; i++) {
      await request(server).post("/api/users").send(userData);
      const getUsersResponse = await request(server).get("/api/users");

      expect(getUsersResponse.body.length).toEqual(i);
    }
    const getUsersFinalResponse = await request(server).get("/api/users");
    getUsersFinalResponse.body.forEach((user: UserType) => {
      usersIds.push(user.id);
    });
  });

  it("several DELETE /api/users increase data size", async () => {
    let usersNumber = usersIds.length;
    for (const id of usersIds) {
     await request(server).delete(`/api/users/${id}`);
      usersNumber -= 1;
      const getUsersFinalResponse = await request(server).get("/api/users");
      expect(getUsersFinalResponse.body.length).toEqual(usersNumber);
    }
  });
});

afterAll((done) => {
  server.close(done);
});
