"use client";

import Button from "@/lib/components/button";
import Input from "@/lib/components/input";
import { backend, IResponse } from "@/lib/scripts/backend";
import { loginUser } from "@/lib/scripts/store/slices/user-slice";
import { AppDispatch } from "@/lib/scripts/store/store";
import { AxiosError, AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const { control, handleSubmit } = useForm<LoginForm>();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    const loginPromise = backend.post("/login", data).then(
      (
        res: AxiosResponse<
          IResponse<{
            token: string;
          }>
        >
      ) => {
        if (!res.data.data) {
          throw new Error("Token is missing");
        }
        dispatch(
          loginUser({
            token: res.data.data.token,
          })
        ).then(() => {
          router.refresh();
        });
      }
    ).finally(() => {
      setLoading(false);
    });

    await toast.promise(loginPromise, {
      loading: "Logging in...",
      success: "Logged in successfully!",
      error: (err) => {
        const error = err as AxiosError<IResponse<unknown>>;
        return error.response?.data.message ?? "Login failed!";
      },
    });
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="lg:max-w-6/12 w-full h-full flex flex-col items-center">
        <h1 className="text-3xl font-bold">Login to Todo</h1>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="mt-4 flex flex-col gap-2"
        >
          <Input
            control={control}
            type="text"
            name="username"
            placeholder="Username"
            required
          />
          <Input
            control={control}
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <Button type="submit" loading={loading}>Login</Button>
        </form>
      </div>
    </div>
  );
}
