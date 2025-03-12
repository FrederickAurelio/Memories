"use client";

import { useActionState, useEffect, useState } from "react";
import { loginUserByEmail } from "../_lib/auth/action";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Form from "next/form";
import Input from "../_components/Input";
import { FaGithub } from "react-icons/fa6";
import Button from "../_components/Button";

const initialState = {
  email: "",
  password: "",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const linkVerify = searchParams.get("verify");
  const linkMessage = searchParams.get("message");
  const [formData, setFormData] = useState(initialState);
  const [actiionState, formAction, isPending] = useActionState(
    loginUserByEmail,
    null,
  );

  useEffect(() => {
    if (actiionState?.success) setFormData(initialState);
  }, [actiionState]);

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
      {actiionState?.message &&
        !actiionState?.message.includes("validation") && (
          <div
            className={`rounded-md border p-3 ${actiionState.success ? "border-green-500 bg-green-200" : "border-red-500 bg-red-200"}`}
          >
            {actiionState?.message}
            {actiionState?.message.includes("not verified") && (
              <p className="cursor-pointer font-semibold underline">
                Click here to resend.
              </p>
            )}
          </div>
        )}

      {linkMessage && !actiionState?.message && (
        <div
          className={`rounded-md border p-3 ${linkVerify === "true" ? "border-green-500 bg-green-200" : "border-red-500 bg-red-200"}`}
        >
          {linkMessage}
          {linkVerify === "true" || (
            <p className="cursor-pointer font-semibold underline">
              Click here to resend.
            </p>
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
        errors={actiionState?.errors}
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
        errors={actiionState?.errors}
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
        <Button
          variant="secondary"
          className="flex justify-center gap-1"
          type="button"
        >
          <FaGithub size={28} />
          <span>Continue with Github</span>
        </Button>
      </div>
    </Form>
  );
}

export default LoginForm;
