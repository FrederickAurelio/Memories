import Image from "next/image";
import Logo from "@/public/Logo.png";
import RecentLogin from "./RecentLogin";
import LoginForm from "./LoginForm";
import { cookies } from "next/headers";
import { BACKEND_BASE_URL } from "../_lib/const";
import { FetchResponse, UserProfile } from "../_lib/types";

async function Login() {
  const cookieStore = await cookies();
  const recentLogin = cookieStore.get("recent-login") || {
    name: "recent-login",
    value: "",
  };
  const emails = recentLogin.value;
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/auth/users-profile?emails=${emails}`,
  );
  const recentLoginUser = (await response.json()) as FetchResponse & {
    data: UserProfile[];
  };

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
        <RecentLogin users={recentLoginUser.data} />
      </div>
      <LoginForm />
    </div>
  );
}

export default Login;
