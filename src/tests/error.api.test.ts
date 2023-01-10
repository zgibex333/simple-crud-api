import request from "supertest";
import http from "http";
import { serverHandler } from "../serverHandler";
import { MESSAGES } from "../utils/messages";

let server: http.Server;

beforeAll((done) => {
  server = http.createServer(serverHandler).listen(3001, done);
});

const incorrectPayload = [
  {
    username: 1,
    age: "",
    hobbies: {},
  },
  {
    username: "name",
    age: 20,
    hobbies: [100, true],
  },
  {
    username: "name",
    age: 20,
  },
];

describe("Testing Errors", () => {
  it("GET to wrong pathes returns correct status code", async () => {
    const wrongpathes = ["/aoi/users", "/api/games", "/api/user"];
    for (const path of wrongpathes) {
      const getUsersResponse = await request(server).get(path);
      expect(getUsersResponse.status).toEqual(MESSAGES.WRONG_PATH.code);
      expect(getUsersResponse.body.message).toEqual(MESSAGES.WRONG_PATH.status);
    }
  });

  it("POST /api/users with incorrect payload returns correct codes", async () => {
    for (const payload of incorrectPayload) {
      const postUserResponse = await request(server)
        .post("/api/users")
        .send(payload);
      expect(postUserResponse.status).toEqual(
        MESSAGES.ALL_FIELDS_REQUIRED.code
      );
      expect(postUserResponse.body.message).toEqual(
        MESSAGES.ALL_FIELDS_REQUIRED.status
      );
    }
  });

  it("GET /api/users/:id returns correct codes depending on id", async () => {
    const notUUIDv4 = "2d930a4a-907a-11ed-a1eb-0242ac120002";
    const UUIDv4 = "a3189a0b-2173-47f1-af46-37437e3ae8df";
    const getByWrongUUIDResponse = await await request(server).get(
      `/api/users/${notUUIDv4}`
    );
    const getByCorrectUUIDResponse = await await request(server).get(
      `/api/users/${UUIDv4}`
    );
    expect(getByWrongUUIDResponse.status).toEqual(MESSAGES.INVALID_ID.code);
    expect(getByWrongUUIDResponse.body.message).toEqual(
      MESSAGES.INVALID_ID.status
    );
    expect(getByCorrectUUIDResponse.status).toEqual(MESSAGES.DOESNT_EXIST.code);
    expect(getByCorrectUUIDResponse.body.message).toEqual(
      MESSAGES.DOESNT_EXIST.status
    );
  });
  it("PUT /api/users/:id with incorrect payload returns correct codes", async () => {
    await request(server)
      .post("/api/users")
      .send({ name: "correct", age: 10, hobbies: [] });
    for (const payload of incorrectPayload) {
      const putUserResponse = await request(server)
        .put("/api/users")
        .send(payload);
      expect(putUserResponse.status).toEqual(
        MESSAGES.ALL_FIELDS_REQUIRED.code
      );
      expect(putUserResponse.body.message).toEqual(
        MESSAGES.ALL_FIELDS_REQUIRED.status
      );
    }
  });

  it("DELETE /api/users/:id returns correct codes depending on id", async () => {
    const notUUIDv4 = "2d930a4a-907a-11ed-a1eb-0242ac120002";
    const UUIDv4 = "a3189a0b-2173-47f1-af46-37437e3ae8df";
    const deleteByWrongUUIDResponse = await await request(server).delete(
      `/api/users/${notUUIDv4}`
    );
    const deleteByCorrectUUIDResponse = await await request(server).delete(
      `/api/users/${UUIDv4}`
    );
    expect(deleteByWrongUUIDResponse.status).toEqual(MESSAGES.INVALID_ID.code);
    expect(deleteByWrongUUIDResponse.body.message).toEqual(
      MESSAGES.INVALID_ID.status
    );
    expect(deleteByCorrectUUIDResponse.status).toEqual(
      MESSAGES.DOESNT_EXIST.code
    );
    expect(deleteByCorrectUUIDResponse.body.message).toEqual(
      MESSAGES.DOESNT_EXIST.status
    );
  });
});

afterAll((done) => {
  server.close(done);
});
