import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/dimension-supply");
  return <>Coming Soon</>;
}
