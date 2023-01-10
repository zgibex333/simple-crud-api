import request from "supertest";
import http from "http";
import { serverHandler } from "../serverHandler";
import { validateUUID } from "../utils/validateUUID";
import { UserType } from "../types";
import { MESSAGES } from "../utils/messages";

let server: http.Server;

beforeAll((done) => {
  server = http.createServer(serverHandler).listen(3000, done);
}, 10000);
const username = "Incognito";
const age = 30;
const hobbies: string[] = [];

const newUsername = "Cognito";
const newAge = 30;
const newHobbies: string[] = ["Sk8ting"];

describe("CRUD Testing", () => {
  let newUserId: string;

  it("GET /api/users returns []", async () => {
    const getUsersResponse = await request(server).get("/api/users");
    expect(getUsersResponse.body).toEqual([]);
    expect(getUsersResponse.status).toEqual(MESSAGES.SUCCESS.code);
  });

  it("POST /api/users creates new user record", async () => {
    const postUserResponse = await request(server).post("/api/users").send({
      username,
      age,
      hobbies,
    });

    const {
      username: user_name,
      age: user_age,
      hobbies: user_hobbies,
      id,
    }: UserType = postUserResponse.body;
    newUserId = id;

    expect(user_name).toBe(username);
    expect(validateUUID(id)).toBe(true);
    expect(user_age).toBe(age);
    expect(Array.isArray(user_hobbies)).toBe(true);
    expect(user_hobbies).toEqual(hobbies);
    expect(postUserResponse.status).toEqual(MESSAGES.CREATED.code);
  });

  it("GET /api/users/:id returns correct user by id", async () => {
    const getByIdResponse = await await request(server).get(
      `/api/users/${newUserId}`
    );

    const {
      username: user_name,
      age: user_age,
      hobbies: user_hobbies,
      id,
    }: UserType = getByIdResponse.body;

    expect(user_name).toBe(username);
    expect(validateUUID(id)).toBe(true);
    expect(user_age).toBe(age);
    expect(Array.isArray(user_hobbies)).toBe(true);
    expect(user_hobbies).toEqual(hobbies);
    expect(getByIdResponse.status).toEqual(MESSAGES.SUCCESS.code);
  });
  it("PUT /api/users/:id updates existing user record", async () => {
    const putUserResponse = await request(server)
      .put(`/api/users/${newUserId}`)
      .send({
        username: newUsername,
        age: newAge,
        hobbies: newHobbies,
      });

    const {
      username: user_name,
      age: user_age,
      hobbies: user_hobbies,
      id,
    }: UserType = putUserResponse.body;
    newUserId = id;

    expect(user_name).toBe(newUsername);
    expect(validateUUID(id)).toBe(true);
    expect(user_age).toBe(newAge);
    expect(Array.isArray(user_hobbies)).toBe(true);
    expect(user_hobbies).toEqual(newHobbies);
    expect(putUserResponse.status).toEqual(MESSAGES.SUCCESS.code);
  });

  it("DELETE /api/users/:id deletes existing user record", async () => {
    const deleteUserResponse = await request(server).delete(
      `/api/users/${newUserId}`
    );
    expect(deleteUserResponse.status).toEqual(MESSAGES.DELETED.code);

    const getByIdResponse = await await request(server).get(
      `/api/users/${newUserId}`
    );
    expect(getByIdResponse.status).toEqual(MESSAGES.DOESNT_EXIST.code);
  });
});

afterAll((done) => {
  server.close(done);
});
