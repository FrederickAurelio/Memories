import Image from "next/image";
import Logo from "@/public/Logo.png";
import Link from "next/link";
import Form from "next/form";
import Input from "../_components/Input";
import { FaGithub } from "react-icons/fa6";
import Button from "../_components/Button";

function SignUp() {
  return (
    <div className="grid h-dvh w-full grid-cols-5 gap-28 px-60 py-20">
      <div className="col-span-2 flex items-center justify-center">
        <Image quality={80} src={Logo} alt="logo" />
      </div>
      {/* add action */}
      <Form className="col-span-3 flex flex-col justify-center gap-4 px-10">
        <div className="flex h-fit w-full items-end justify-between pb-4">
          <h1 className="text-4xl font-semibold">Create an account</h1>
          <Link href="/login" className="underline">
            log in instead
          </Link>
        </div>
        <Input placeholder="First Name" id="firstName" />
        <Input placeholder="Last Name" id="lastName" />
        <Input placeholder="Email" id="email" />
        <Input placeholder="Password" id="password" type="password" />
        <div className="flex w-full justify-between pt-3">
          <Button variant="primary" type="submit">
            Create an account
          </Button>
          <span className="mx-4 border-r-2 border-neutral-400"></span>
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
    </div>
  );
}

export default SignUp;
