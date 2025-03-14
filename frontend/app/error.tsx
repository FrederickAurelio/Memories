"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Button from "./_components/Button";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
          <Button
            className="mt-1 w-2/3"
            variant="primary"
            onClick={() => reset()}
          >
            Try again
          </Button>
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
