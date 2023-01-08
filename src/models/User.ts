import { UserType } from "../types";
import { v4 as uuid } from "uuid";

let users: UserType[] = [];

process.on("message", (msg: UserType[]) => {
  users = msg;
});

export const User = {
  allUsers: () =>
    new Promise((resolve) => {
      resolve(users);
    }),
  getUserById: (id: string) =>
    new Promise<UserType | undefined>((resolve, reject) => {
      const user = users.find((user) => user.id === id);
      if (user) {
        resolve(user);
      }
      resolve(undefined);
    }),

  create: (userData: Omit<UserType, "id">) =>
    new Promise((resolve, reject) => {
      try {
        const newUser = { ...userData, id: uuid() };
        users.push(newUser);
        if (process.send) process.send(users);
        resolve(newUser);
      } catch {
        reject(undefined);
      }
    }),
  updateExisting: (id: string, userData: Omit<UserType, "id">) =>
    new Promise<UserType>((resolve, reject) => {
      try {
        const user = users.find((user) => user.id === id);
        if (!user) {
          reject(undefined);
        } else {
          user.age = userData.age;
          user.hobbies = userData.hobbies;
          user.username = userData.username;
          if (process.send) process.send(users);
          resolve(user);
        }
      } catch {
        reject(undefined);
      }
    }),
  deleteExisting: (id: string) =>
    new Promise((resolve, reject) => {
      try {
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) {
          reject(undefined);
        }
        users.splice(index, 1);
        if (process.send) process.send(users);
        resolve(id);
      } catch {
        reject(undefined);
      }
    }),
};
