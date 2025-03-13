"use client";

import Link from "next/link";
import Form from "next/form";
import Input from "../_components/Input";
import { FaGithub } from "react-icons/fa6";
import Button from "../_components/Button";

import { registerUserByEmail } from "../_lib/auth/action";
import { useActionState, useEffect, useState } from "react";
import ResendEmailVerif from "./ResendEmailVerif";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

function SignUpForm() {
  const [formData, setFormData] = useState(initialState);
  const [actionState, formAction, isPending] = useActionState(
    registerUserByEmail,
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
        <h1 className="text-4xl font-semibold">Create an account</h1>
        <Link href="/login" className="underline">
          login instead
        </Link>
      </div>
      {actionState?.message && !actionState?.message.includes("validation") && (
        <div
          className={`rounded-md border p-3 ${actionState.success ? "border-green-500 bg-green-200" : "border-red-500 bg-red-200"}`}
        >
          {actionState?.message}
          {actionState.success ? (
            <ResendEmailVerif email={actionState?.data.email}>
              {""}Didn&apos;t receive the email? Click here to resend.{" "}
            </ResendEmailVerif>
          ) : (
            ""
          )}
        </div>
      )}
      <Input
        required
        disabled={isPending}
        placeholder="First Name"
        id="firstName"
        setFormData={setFormData}
        formData={formData}
        errors={actionState?.errors}
      />
      <Input
        disabled={isPending}
        placeholder="Last Name"
        id="lastName"
        setFormData={setFormData}
        formData={formData}
        errors={actionState?.errors}
      />
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
        autoComplete="new-password"
        placeholder="Password"
        id="password"
        type="password"
        setFormData={setFormData}
        formData={formData}
        errors={actionState?.errors}
      />
      <div className="flex w-full justify-between pt-3">
        <Button disabled={isPending} variant="primary" type="submit">
          Create an account
        </Button>
        <span className="mx-4 border-r-2 border-neutral-400"></span>
        <Button
          disabled={isPending}
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

export default SignUpForm;
