import Logo from "@/public/Logo.png";
import Image from "next/image";
import LoginForm from "./LoginForm";
import RecentLogin from "./RecentLogin";
import { getUserProfile } from "../_lib/auth/action";

async function Login() {
  const recentLoginUser = await getUserProfile();

  return (
    <div className="grid h-dvh w-full grid-cols-5 gap-28 px-60 py-20">
      <div className="col-span-2">
        <Image
          className="pb-2"
          quality={80}
          height={0}
          width={0}
          style={{ width: "100px", height: "auto" }}
          src={Logo}
          alt="logo"
        />
        <h1 className="text-3xl font-semibold">Recent login</h1>
        <p>Welcome back! Click your account below to log in quickly.</p>
        <RecentLogin users={recentLoginUser} />
      </div>
      <LoginForm />
    </div>
  );
}

export default Login;
