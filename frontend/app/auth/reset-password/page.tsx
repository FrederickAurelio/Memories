import { redirect } from "next/navigation";
import ResetForm from "./ResetForm";
import Link from "next/link";

async function Reset({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const resetToken = (await searchParams).resetToken;
  const userId = (await searchParams).userId;
  if (!resetToken || !userId) redirect("/login");
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <div className="w-96">
        <h1 className="mb-3 text-center text-4xl font-semibold">
          Create New Password
        </h1>
        <p className="mb-3 text-center text-neutral-500">
          Enter your new password below to complete the reset process. Ensure
          it&apos;s strong and secure
        </p>
        <ResetForm resetToken={resetToken} userId={userId} />
        <div className="flex items-center justify-center">
          <Link
            href="/login"
            className="jus mt-2 flex items-center text-center font-semibold underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Reset;
