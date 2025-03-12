"use client";

import UserLogin from "./UserLogin";
import AddUserLogin from "./AddUserLogin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import Form from "next/form";
import Input from "../_components/Input";
import Button from "../_components/Button";
import Link from "next/link";
import { loginUserByEmail } from "../_lib/auth/action";
import { startTransition } from "react";
import { UserProfile } from "../_lib/types";

const initialState = {
  password: "",
};

function RecentLogin({ users }: { users: UserProfile[] }) {
  console.log(users);
  const [selectedUser, setSelectedUser] = useState<null | UserProfile>(null);
  const [actiionState, formAction, isPending] = useActionState(
    loginUserByEmail,
    null,
  );
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (actiionState?.success) setFormData(initialState);
  }, [actiionState]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSelectedUser(null);
          setFormData(initialState);
          if (actiionState?.message.length)
            startTransition(() => {
              formAction(null);
            });
        }
      }}
    >
      <div className="flex flex-wrap gap-3 py-5">
        {[
          users.map((user) => (
            <DialogTrigger
              onClick={() => setSelectedUser(user)}
              key={user.email}
            >
              <UserLogin firstName={user.firstName} image={user.avatar} />
            </DialogTrigger>
          )),
        ]}
        {users.length < 4 && <AddUserLogin />}
      </div>

      <DialogContent className="p-10">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-semibold">
            Welcome back!
          </DialogTitle>
          {selectedUser ? (
            <div className="flex flex-col items-center justify-center p-3">
              <div className="relative h-32 w-32">
                <Image
                  fill
                  quality={80}
                  src={selectedUser?.avatar}
                  alt={selectedUser?.firstName}
                  className="rounded-full border border-neutral-300 object-cover"
                />
              </div>

              <p className="text-lg leading-tight">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </p>
              <p className="text-sm font-extralight">{selectedUser?.email}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-3">
              <div className="h-32 w-32 animate-pulse rounded-full border border-neutral-300 bg-neutral-200 object-cover" />
              <p className="m-2 h-4 w-36 animate-pulse rounded-md border border-neutral-300 bg-neutral-200"></p>
              <p className="h-3 w-32 animate-pulse rounded-md border border-neutral-300 bg-neutral-200"></p>
            </div>
          )}
          <div className="flex flex-col items-center justify-center">
            {actiionState?.message &&
              !actiionState?.message.includes("validation") && (
                <div
                  className={`mb-3 w-9/12 rounded-md border p-3 ${actiionState.success ? "border-green-500 bg-green-200" : "border-red-500 bg-red-200"}`}
                >
                  {actiionState?.message}
                </div>
              )}
            <Form action={formAction} className="w-80">
              <input
                defaultValue={selectedUser?.email}
                hidden
                name="email"
                id="email"
                autoComplete="email"
              />
              <Input
                required
                disabled={isPending}
                placeholder="Password"
                id="password"
                type="password"
                autoComplete="current-password"
                formData={formData}
                setFormData={setFormData}
                errors={actiionState?.errors}
              />
              <Button variant="primary" type="submit" className="mt-3">
                Log in
              </Button>
            </Form>
            <DialogDescription className="mt-2">
              <Link
                href="/forgot"
                className="text-center font-semibold underline"
              >
                Forget your password?
              </Link>
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default RecentLogin;
