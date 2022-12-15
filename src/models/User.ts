import { rejects } from "assert";
import { users } from "../data/usersData";
import { UserType } from "../types";
import { v4 as uuid } from "uuid";

export const User = {
  allUsers: () =>
    new Promise((resolve, reject) => {
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
      const newUser = { ...userData, id: uuid() };
      users.push(newUser);
      resolve(newUser);
    }),
  updateExisting: (id: string, userData: Omit<UserType, "id">) =>
    new Promise<UserType>((resolve, reject) => {
      const user = users.find((user) => user.id === id);
      if (!user) {
        reject();
      } else {
        user.age = userData.age;
        user.hobbies = userData.hobbies;
        user.username = userData.username;
        resolve(user);
      }
    }),
  deleteExisting: (id: string) =>
    new Promise((resolve, reject) => {
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) {
        reject();
      }
      users.splice(index, 1);
      resolve(id);
    }),
};
