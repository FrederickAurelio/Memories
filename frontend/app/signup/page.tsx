import Image from "next/image";
import Logo from "@/public/Logo.png";
import SignUpForm from "./SignUpForm";

function SignUp() {
  return (
    <div className="grid h-dvh w-full grid-cols-5 gap-28 px-60 py-20">
      <div className="col-span-2 flex items-center justify-center">
        <Image
          className="animate-wiggle animate-duration-[3000ms] animate-infinite animate-ease-in"
          quality={80}
          src={Logo}
          alt="logo"
        />
      </div>
      <SignUpForm />
    </div>
  );
}

export default SignUp;
