"use client";

import Image from "next/image";
import Logo from "@/public/Logo.png";
import Link from "next/link";
import Form from "next/form";
import Input from "../_components/Input";
import { FaGithub } from "react-icons/fa6";
import Button from "../_components/Button";
import { registerUserByEmail } from "../_lib/auth/action";
import { useActionState, useEffect, useState } from "react";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

function SignUp() {
  const [formData, setFormData] = useState(initialState);
  const [actiionState, formAction, isPending] = useActionState(
    registerUserByEmail,
    null,
  );

  useEffect(() => {
    if (actiionState?.success) setFormData(initialState);
  }, [actiionState]);

  return (
    <div className="grid h-dvh w-full grid-cols-5 gap-28 px-60 py-20">
      <div className="col-span-2 flex items-center justify-center">
        <Image
          className="animate-wiggle animate-duration-[3000ms] animate-infinite animate-ease-in"
          quality={80}
          src={Logo}
          alt="logo"
        />
      </div>
      {/* add action */}
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
        {actiionState?.message &&
          !actiionState?.message.includes("validation") && (
            <div
              className={`rounded-md border p-3 ${actiionState.success ? "border-green-500 bg-green-200" : "border-red-500 bg-red-200"}`}
            >
              {actiionState?.message}
              {actiionState.success ? (
                <p className="cursor-pointer font-semibold underline">
                  {""}Didn&apos;t receive the email? Click here to resend.
                </p>
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
          errors={actiionState?.errors}
        />
        <Input
          disabled={isPending}
          placeholder="Last Name"
          id="lastName"
          setFormData={setFormData}
          formData={formData}
          errors={actiionState?.errors}
        />
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
          autoComplete="new-password"
          placeholder="Password"
          id="password"
          type="password"
          setFormData={setFormData}
          formData={formData}
          errors={actiionState?.errors}
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
    </div>
  );
}

export default SignUp;
