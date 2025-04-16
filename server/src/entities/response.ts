import { Response } from "express";

export class ResponseEntity<T> {
  status: number;
  message: string;
  data?: T;

  constructor(data?: T, status: number = 200, message: string = "Success") {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export const generateResponse = <T>(
  res: Response,
  data: T,
  status: number = 200,
  message: string = "Success"
): Response => {
  const response = new ResponseEntity<T>(data, status, message);
  return res.status(status).json(response);
}