import { backend, IResponse } from "@/lib/scripts/backend";
import { Todo } from "@/lib/types/todo";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import Header from "./header";
import Table from "./table";

export default async function Home() {
  const auth = (await cookies()).get("authorization")?.value;
  const data = await backend.get("/todo", {
    headers: {
      Authorization: auth as string,
    }
  }).then((res: AxiosResponse<IResponse<Todo[]>>) => res.data.data);
  return (
    <>
      <Header />
      <div className="overflow-x-auto">
        <Table data={data ?? []} />
      </div>
    </>
  );
}
