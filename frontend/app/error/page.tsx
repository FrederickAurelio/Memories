import { MdOutlineReportGmailerrorred } from "react-icons/md";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center">
      <div className="flex w-96 -translate-y-3 flex-col items-center">
        <MdOutlineReportGmailerrorred className="mb-1" size={120} />
        <h1 className="mb-2 text-center text-3xl font-semibold">
          Something went wrong!
        </h1>
        <p className="mb-3 text-center text-neutral-500">
          Looks like something went wrong—maybe a server issue or a network
          glitch. Please try again!
        </p>
        <div className="flex w-full items-center justify-center">
          <Link
            href={"/app"}
            className={`w-full rounded-full bg-neutral-800 p-3 text-center text-lg text-neutral-200 duration-100 hover:scale-105 disabled:cursor-not-allowed disabled:bg-neutral-600 disabled:hover:scale-100`}
          >
            Back to App
          </Link>
        </div>
        <Link
          href="/login"
          className="jus mt-2 flex items-center text-center font-semibold underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
