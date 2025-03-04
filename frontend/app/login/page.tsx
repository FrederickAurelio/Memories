import Image from "next/image";
import Logo from "@/public/Logo.png";
import Link from "next/link";
import Form from "next/form";
import Input from "../_components/Input";
import { FaGithub } from "react-icons/fa6";
import Button from "../_components/Button";
import RecentLogin from "../_components/RecentLogin";

function Login() {
  return (
    <div className="grid h-dvh w-full grid-cols-5 gap-28 px-60 py-20">
      <div className="col-span-2">
        <Image
          className="pb-2"
          quality={80}
          height={100}
          width={100}
          src={Logo}
          alt="logo"
        />
        <h1 className="text-3xl font-semibold">Recent login</h1>
        <p>Welcome back! Click your account below to log in quickly.</p>
        <RecentLogin />
      </div>
      {/* add action */}
      <Form className="col-span-3 flex flex-col justify-center gap-4 px-10">
        <div className="flex h-fit w-full items-end justify-between pb-4">
          <h1 className="text-4xl font-semibold">Log in</h1>
          <Link href="/signup" className="underline">
            Don&apos;t have an account?
          </Link>
        </div>
        <Input autoComplete="email" placeholder="Email" id="email" />{" "}
        <Input
          placeholder="Password"
          id="password"
          type="password"
          autoComplete="current-password"
        />
        <Button variant="primary" type="submit" className="mt-2">
          Log in
        </Button>
        <Link href="/signup" className="text-center font-semibold underline">
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
    </div>
  );
}

export default Login;
