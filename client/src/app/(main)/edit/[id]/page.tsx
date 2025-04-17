import { backend } from "@/lib/scripts/backend";
import EditForm from "./editform";
import { cookies } from "next/headers";

export default async function EditPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = await params;
  const auth = (await cookies()).get("authorization")?.value;
  const data = await backend.get(`/todo/${id}`, {
    headers: {
      Authorization: auth,
    },
  }).then((res) => res.data.data);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Todo</h1>
      <EditForm defaultValues={data} />
    </div>
  );
}
