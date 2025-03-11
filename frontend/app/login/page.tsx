import Image from "next/image";
import Logo from "@/public/Logo.png";
import RecentLogin from "./RecentLogin";
import LoginForm from "./LoginForm";

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
      <LoginForm />
    </div>
  );
}

export default Login;
