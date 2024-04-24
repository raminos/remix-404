import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({ value: "Server" });
}

export default function SamplePage() {
  const data = useLoaderData<typeof loader>();
  return <h1>Hello {data.value ?? "Client"}</h1>;
}
