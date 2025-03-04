import Form from "next/form";
import Input from "../_components/Input";
import Button from "../_components/Button";
import Link from "next/link";

function Reset() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <div className="w-96">
        <h1 className="mb-3 text-center text-4xl font-semibold">
          Create a New Password
        </h1>
        <p className="mb-6 text-center text-neutral-500">
          Enter your new password below to complete the reset process. Ensure
          it&apos;s strong and secure
        </p>
        <Form>
          <Input
            placeholder="New Password"
            id="newPassword"
            type="password"
            autoComplete="new-password"
            className="mb-2"
          />
          <Input
            placeholder="Repeat new Password"
            id="repeatNewPassword"
            type="password"
            autoComplete="new-password"
          />
          <Button variant="primary" type="submit" className="mt-3">
            Reset
          </Button>
        </Form>
        <div className="flex items-center justify-center"></div>
      </div>
    </div>
  );
}

export default Reset;
