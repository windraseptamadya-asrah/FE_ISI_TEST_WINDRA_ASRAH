"use client";

import Button from "@/lib/components/button";
import Input from "@/lib/components/input";
import { backend } from "@/lib/scripts/backend";
import { IState } from "@/lib/scripts/store/store-provider";
import { useGetCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface AddTodoForm {
  title: string;
  description: string;
  deadline: string;
}

export default function AddPage() {
  const [loading, setLoading] = useState(false);
  const { register, control, handleSubmit } = useForm<AddTodoForm>();
  const router = useRouter();
  const { user, domReady } = useSelector((state: IState) => state.user);
  const cookie = useGetCookie();

  if (domReady && user?.role !== "lead") {
    toast.error("Only lead can add todo");
    router.push("/");
  }

  const handleAddTodo = async (data: AddTodoForm) => {
    const authCookie = cookie("authorization");
    setLoading(true);
    await backend.post("/todo", data, {
      headers: {
        Authorization: authCookie,
      }
    }).then(() => {
      toast.success("Todo added successfully");
      router.push("/");
      router.refresh();
    }).catch((err) => {
      toast.error(err.response.data.message ?? "Failed to add todo");
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Add Todo</h1>
      <form
        onSubmit={handleSubmit(handleAddTodo)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="task" className="text-sm font-semibold">
            Task
          </label>
          <Input
            control={control}
            name="title"
            id="task"
            type="text"
            className="border border-gray-300 rounded !p-2"
            placeholder="Task name"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-semibold">
            Description
          </label>
          <Input
            control={control}
            name="description"
            id="description"
            type="text"
            className="border border-gray-300 rounded !p-2"
            placeholder="Task description"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="date" className="text-sm font-semibold">
            Deadline date
          </label>
          <input
            {...register("deadline", { required: true })}
            type="date"
            id="date"
            placeholder="Deadline date"
            className="rounded-sm border border-neutral-500 outline-none p-2"
          />
        </div>
        <Button type="submit" loading={loading}>Add Todo</Button>
      </form>
    </div>
  );
}
