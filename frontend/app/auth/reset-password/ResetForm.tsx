"use client";
import { resetPassowrd } from "@/app/_lib/auth/action";
import { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import Input from "../../_components/Input";
import Button from "../../_components/Button";

const initialState = {
  newPassword: "",
  repeatNewPassword: "",
};

function ResetForm({
  resetToken,
  userId,
}: {
  resetToken: string;
  userId: string;
}) {
  const [formData, setFormData] = useState(initialState);
  const [actionState, formAction, isPending] = useActionState(
    resetPassowrd,
    null,
  );
  useEffect(() => {
    if (actionState?.success) {
      setFormData(initialState);
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
        <input
          defaultValue={resetToken}
          hidden
          name="resetToken"
          id="resetToken"
        />
        <input defaultValue={userId} hidden name="userId" id="userId" />
        <Input
          required
          disabled={isPending}
          placeholder="New Password"
          id="newPassword"
          type="password"
          autoComplete="new-password"
          className="mb-2"
          formData={formData}
          setFormData={setFormData}
          errors={actionState?.errors}
        />
        <Input
          required
          disabled={isPending}
          placeholder="Repeat new Password"
          id="repeatNewPassword"
          type="password"
          autoComplete="new-password"
          formData={formData}
          setFormData={setFormData}
          errors={actionState?.errors}
        />
        <Button
          disabled={isPending}
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

export default ResetForm;
