import { IncomingMessage, ServerResponse } from "http";

export type Req = IncomingMessage;
export type Res = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
};

export type UserType = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};
