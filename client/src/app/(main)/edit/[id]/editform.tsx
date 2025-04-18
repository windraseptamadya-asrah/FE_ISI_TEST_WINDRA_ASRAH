"use client";

import Button from "@/lib/components/button";
import Input from "@/lib/components/input";
import { backend } from "@/lib/scripts/backend";
import { IState } from "@/lib/scripts/store/store-provider";
import { Todo } from "@/lib/types/todo";
import { useGetCookie } from "cookies-next";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface EditTodoForm {
  title: string;
  description: string;
  deadline: string;
  status: string;
}

export default function EditForm({
  defaultValues,
}: Readonly<{
  defaultValues: Todo;
}>) {
  const { title, description, deadline, status } = defaultValues;
  const [loading, setLoading] = useState(false);
  const { register, control, handleSubmit } = useForm<EditTodoForm>({
    defaultValues: {
      title,
      description,
      deadline: dayjs(deadline).format("YYYY-MM-DD"),
      status,
    },
  });
  const router = useRouter();
  const { user } = useSelector((state: IState) => state.user);
  const cookie = useGetCookie();
  const isLead = user?.role === "lead";

  const handleEditTodo = async (data: EditTodoForm) => {
    const authCookie = cookie("authorization");
    setLoading(true);
    try {
      if (isLead) {
        await backend.put(`/todo/${defaultValues.id}`, data, {
          headers: {
            Authorization: authCookie,
          },
        }).catch((err) => {throw err});
      } else {
        await backend.patch(
          `/todo/${defaultValues.id}`,
          data,
          {
            headers: {
              Authorization: authCookie,
            },
          }
        ).catch((err) => {throw err});
      }
      toast.success("Todo edited successfully");
      router.push("/");
      router.refresh();
    } catch (e) {
      toast.error("Failed to edit todo");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleEditTodo)}
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
          disabled={!isLead}
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
          className="rounded-sm border border-neutral-500 outline-none p-2 disabled:opacity-20"
          disabled={!isLead}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-sm font-semibold">
          Status
        </label>
        <select
          className="w-full border border-gray-300 rounded p-2"
          {...register("status", { required: true })}
          id="status"
        >
          <option value="" disabled>
            Select
          </option>
          <option value="Not Started">Not Started</option>
          <option value="On Progress">On Progress</option>
          <option value="Done">Done</option>
          <option value="Reject">Reject</option>
        </select>
      </div>
      <Button type="submit" loading={loading}>
        Edit Todo
      </Button>
    </form>
  );
}
