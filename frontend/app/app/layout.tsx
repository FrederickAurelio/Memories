import { headers } from "next/headers";
import Sidebar from "./Sidebar";

async function LayoutApp({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  return (
    <div className="flex h-dvh w-full bg-neutral-200">
      <Sidebar pathname={pathname} />
      <div className="mr-3 mt-3 w-full rounded-t-2xl bg-neutral-100 px-4 py-2 shadow-lg drop-shadow-lg">
        {children}
      </div>
    </div>
  );
}

export default LayoutApp;
