"use client";

import { useActionState, useEffect, useState } from "react";
import { loginUserByEmail } from "../_lib/auth/action";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Form from "next/form";
import Input from "../_components/Input";
import Button from "../_components/Button";
import ResendEmailVerif from "../signup/ResendEmailVerif";
import GitHubSignInButton from "../signup/GitHubSignInButton";

const initialState = {
  email: "",
  password: "",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const linkVerify = searchParams.get("verify");
  const linkMessage = searchParams.get("message");
  const emailLink = searchParams.get("emailLink");
  const [formData, setFormData] = useState(initialState);
  const [actionState, formAction, isPending] = useActionState(
    loginUserByEmail,
    null,
  );

  useEffect(() => {
    if (actionState?.success) setFormData(initialState);
  }, [actionState]);

  return (
    <Form
      action={formAction}
      className="col-span-3 flex flex-col justify-center gap-4 px-10"
    >
      <div className="flex h-fit w-full items-end justify-between pb-4">
        <h1 className="text-4xl font-semibold">Log in</h1>
        <Link href="/signup" className="underline">
          Don&apos;t have an account?
        </Link>
      </div>
      {actionState?.message && !actionState?.message.includes("validation") && (
        <div
          className={`rounded-md border p-3 ${actionState.success ? "border-green-500 bg-green-200" : "border-red-500 bg-red-200"}`}
        >
          {actionState?.message}
          {actionState?.message.includes("not verified") && (
            <ResendEmailVerif email={actionState?.errors.emailLink}>
              Click here to resend.
            </ResendEmailVerif>
          )}
        </div>
      )}

      {linkMessage && !actionState?.message && (
        <div
          className={`rounded-md border p-3 ${linkVerify === "true" ? "border-green-500 bg-green-200" : "border-red-500 bg-red-200"}`}
        >
          {linkMessage}
          {linkVerify === "true" || (
            <ResendEmailVerif email={emailLink || ""}>
              Click here to resend.
            </ResendEmailVerif>
          )}
        </div>
      )}
      <Input
        required
        disabled={isPending}
        autoComplete="email"
        placeholder="Email"
        id="email"
        setFormData={setFormData}
        formData={formData}
        errors={actionState?.errors}
      />
      <Input
        required
        disabled={isPending}
        placeholder="Password"
        id="password"
        type="password"
        autoComplete="current-password"
        setFormData={setFormData}
        formData={formData}
        errors={actionState?.errors}
      />
      <Button
        disabled={isPending}
        variant="primary"
        type="submit"
        className="mt-2"
      >
        Log in
      </Button>
      <Link href="/forgot" className="text-center font-semibold underline">
        Forget your password?
      </Link>
      <div className="grid w-full grid-cols-9 justify-between pt-2">
        <span className="col-span-4 mt-2 border-t-2 border-neutral-400"></span>
        <span className="col-span-1 -translate-y-1 text-center">OR</span>
        <span className="col-span-4 mt-2 border-t-2 border-neutral-400"></span>
      </div>
      <div className="flex w-full justify-between pt-2">
        <GitHubSignInButton globalPending={isPending} />
      </div>
    </Form>
  );
}

export default LoginForm;
