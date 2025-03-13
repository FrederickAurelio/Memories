import Link from "next/link";
import ForgetForm from "./ForgetForm";

function ForgotPassword() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <div className="w-96">
        <h1 className="mb-3 text-center text-4xl font-semibold">
          Forgot Password
        </h1>
        <p className="mb-3 text-center text-neutral-500">
          No worries! Enter your email address below, and we&apos;ll send you a
          link to reset your password.
        </p>
        <ForgetForm />
        <div className="flex items-center justify-center">
          <Link
            href="/login"
            className="mt-2 text-center font-semibold underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
