"use client";
import Form from "next/form";
import Input from "../_components/Input";
import Button from "../_components/Button";
import { useActionState, useEffect, useState } from "react";
import { forgetPassword } from "../_lib/auth/action";

const initialState = {
  email: "",
};

function ForgetForm() {
  const [isCooldown, setIsCooldown] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [actionState, formAction, isPending] = useActionState(
    forgetPassword,
    null,
  );

  useEffect(() => {
    if (actionState?.success) {
      setFormData(initialState);
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 60000);
    }
  }, [actionState]);
  return (
    <>
      {actionState?.message && !actionState?.message.includes("validation") && (
        <div
          className={`rounded-md border p-3 ${actionState.success ? "border-green-500 bg-green-200" : "border-red-500 bg-red-200"}`}
        >
          {actionState?.message}
        </div>
      )}
      <Form className="mt-3" action={formAction}>
        <Input
          required
          disabled={isPending || isCooldown}
          autoComplete="email"
          placeholder="Email"
          id="email"
          formData={formData}
          setFormData={setFormData}
          errors={actionState?.errors}
        />{" "}
        <Button
          disabled={isPending || isCooldown}
          variant="primary"
          type="submit"
          className="mt-3"
        >
          Reset
        </Button>
      </Form>
    </>
  );
}

export default ForgetForm;
