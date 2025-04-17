import axios from "axios";

export interface IResponse<T> {
  status: number;
  message: string;
  data?: T;
}

export const backend = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000'}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});