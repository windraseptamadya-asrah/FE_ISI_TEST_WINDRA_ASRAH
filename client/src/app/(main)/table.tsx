"use client";

import Button from "@/lib/components/button";
import Modal from "@/lib/components/modals";
import { backend, IResponse } from "@/lib/scripts/backend";
import { IState } from "@/lib/scripts/store/store-provider";
import { Todo } from "@/lib/types/todo";
import { User } from "@/lib/types/user";
import { faEdit, faTrash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosResponse } from "axios";
import { useGetCookie } from "cookies-next";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Table({ data }: Readonly<{ data: Todo[] }>) {
  const [assignModalOpen, setAssignModalOpen] = useState<number | null>(null);
  const [assignTo, setAssignTo] = useState<string | undefined>(undefined);
  const [userList, setUserList] = useState<User[]>([]);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const cookie = useGetCookie();
  const router = useRouter();
  const { user } = useSelector((state: IState) => state.user);
  const isLead = user?.role === "lead";

  const resetAssignTo = () => {
    setAssignTo(undefined);
    setAssignModalOpen(null);
  };

  const assignToHandler = async () => {
    try {
      if (!assignTo)
        throw new Error("Please select a user to assign the task to");

      await backend.patch(
        `/todo/${assignModalOpen}/assign`,
        {
          assignedTo: assignTo,
        },
        {
          headers: {
            Authorization: cookie("authorization"),
          },
        }
      );
      resetAssignTo();
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  useEffect(() => {
    if (assignModalOpen && isLead) {
      backend
        .get("/user/all", {
          headers: {
            Authorization: cookie("authorization"),
          },
        })
        .then((res: AxiosResponse<IResponse<User[]>>) => {
          setUserList(res.data.data ?? []);
        });
    }
  }, [assignModalOpen, cookie, isLead]);

  const handleDeleteTodo = async () => {
    try {
      await backend.delete(`/todo/${deleteModal}`, {
        headers: {
          Authorization: cookie("authorization"),
        },
      });
      toast.success("Todo deleted successfully");
      setDeleteModal(null);
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <>
      <table className="w-full">
        <thead>
          <tr>
            <th>No</th>
            <th>Task</th>
            <th>Description</th>
            <th>Assigned to</th>
            <th>Status</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((todo, idx) => (
            <tr key={todo.id}>
              <td className="px-2 py-3">{idx + 1}</td>
              <td className="px-2 py-3">{todo.title}</td>
              <td className="px-2 py-3">{todo.description}</td>
              <td className="px-2 py-3">
                {todo.assigned_to_name ?? "Not assigned"}
              </td>
              <td className="px-2 py-3">{todo.status}</td>
              <td className="px-2 py-3">
                {dayjs(todo.createdAt).format("DD MMM YYYY")}
              </td>
              <td className="px-2 py-3">
                {dayjs(todo.updatedAt).format("DD MMM YYYY")}
              </td>
              <td className="px-2 py-3">
                <div className="space-x-2 flex justify-end">
                  {isLead && (
                    <Button
                      className="!px-2 !py-1"
                      onClick={() => setAssignModalOpen(todo.id)}
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                      Assign
                    </Button>
                  )}
                  <Link href={`/edit/${todo.id}`}>
                    <Button className="!px-2 !py-1">
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Edit
                    </Button>
                  </Link>
                  {isLead && (
                    <Button
                      className="!px-2 !py-1 !bg-red-500 hover:!bg-red-600 text-white"
                      onClick={() => setDeleteModal(todo.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={Boolean(assignModalOpen)}
        title="Assign task to: "
        description={
          <select
            className="w-full border border-gray-300 rounded p-2"
            value={assignTo}
            onChange={(e) => setAssignTo(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select
            </option>
            {userList.length > 0 ? (
              userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Loading...
              </option>
            )}
          </select>
        }
        onClose={() => resetAssignTo()}
        onConfirm={async () => assignToHandler()}
      />

      <Modal
        isOpen={Boolean(deleteModal)}
        title="Delete todo"
        description="Are you sure you want to delete this todo?"
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteTodo}
        confirmButtonClassName="text-red-500 hover:bg-red-500/10"
      />
    </>
  );
}
