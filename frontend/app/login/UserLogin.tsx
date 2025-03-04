import Image from "next/image";

function UserLogin({ image, firstName }: { image: string; firstName: string }) {
  return (
    <div className="h-44 w-40 cursor-pointer rounded-lg border border-neutral-400 duration-150 hover:scale-105">
      <div className="relative h-[138px] w-[160px]">
        <Image
          fill
          quality={80}
          src={image}
          alt={firstName}
          className="rounded-t-lg border-b border-neutral-400 object-cover pr-[2px]"
        />
      </div>

      <p className="flex h-[35px] items-center justify-center">{firstName}</p>
    </div>
  );
}

export default UserLogin;
