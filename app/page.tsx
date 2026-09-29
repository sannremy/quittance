import ToolForm from "./tool-form";
import { fetchIrlEntries } from "@/lib/irl-data";

export default async function Home() {
  const irlEntries = await fetchIrlEntries();

  return (
    <div>
      <ToolForm irlEntries={irlEntries} />
    </div>
  );
}
