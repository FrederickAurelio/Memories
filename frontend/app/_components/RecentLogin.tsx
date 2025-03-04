"use client";

import UserLogin from "../_components/UserLogin";
import AddUserLogin from "../_components/AddUserLogin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import Form from "next/form";
import Input from "./Input";
import Button from "./Button";
import Link from "next/link";

type User = {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

const mockUsers = [
  {
    email: "frederick.ah88@gmail.com",
    firstName: "Frederick",
    lastName: "Halim",
    avatar: "/Frederick.jpeg",
  },
  {
    email: "Ayaka@gmail.com",
    firstName: "Ayaka",
    lastName: "Kamisato",
    avatar: "/Genshin.jpg",
  },
  {
    email: "Kirby8@gmail.com",
    firstName: "Kirby",
    lastName: "",
    avatar: "/Kirby.jpg",
  },
] as User[];

function RecentLogin() {
  const [selectedUser, setSelectedUser] = useState<null | User>(null);

  return (
    <Dialog onOpenChange={(isOpen) => (isOpen ? "" : setSelectedUser(null))}>
      <div className="flex flex-wrap gap-3 py-5">
        {[
          mockUsers.map((user) => (
            <DialogTrigger
              onClick={() => setSelectedUser(user)}
              key={user.email}
            >
              <UserLogin firstName={user.firstName} image={user.avatar} />
            </DialogTrigger>
          )),
        ]}
        <AddUserLogin />
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
            <Form className="w-80">
              <input
                defaultValue={selectedUser?.email}
                hidden
                name="email"
                id="email"
                autoComplete="email"
              />
              <Input
                placeholder="Password"
                id="password"
                type="password"
                autoComplete="current-password"
              />
              <Button variant="primary" type="submit" className="mt-2">
                Log in
              </Button>
            </Form>
            <DialogDescription className="mt-2">
              <Link
                href="/signup"
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
