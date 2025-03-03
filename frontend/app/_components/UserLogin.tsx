import Image from "next/image";

function UserLogin({ image, firstName }: { image: string; firstName: string }) {
  return (
    <div className="h-44 w-40 cursor-pointer rounded-lg border border-neutral-400 duration-150 hover:scale-105">
      <Image
        width={160}
        height={138}
        quality={80}
        src={image}
        alt={firstName}
        className="h-[138px] rounded-t-lg border-b border-neutral-400 object-cover"
      />
      <p className="flex h-[35px] items-center justify-center">{firstName}</p>
    </div>
  );
}

export default UserLogin;
