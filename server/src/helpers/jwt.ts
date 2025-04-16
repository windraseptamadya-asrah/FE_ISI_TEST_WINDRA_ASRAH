import jwt from "jsonwebtoken";

export interface UserPayload {
  id: number;
  role: string;
}

export function signToken(payload: UserPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "12h",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string);
}