"use client";

function AddUserLogin() {
  function handleClick() {
    const inputEmail = document.getElementById(
      "email",
    ) as HTMLInputElement | null;
    inputEmail?.focus();
  }
  return (
    <div
      onClick={handleClick}
      className="h-44 w-40 cursor-pointer rounded-lg border border-neutral-400 duration-150 hover:scale-105"
    >
      <div className="flex h-[137px] w-[158px] items-center justify-center rounded-t-lg border-b border-neutral-400 bg-neutral-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-400 text-2xl font-semibold text-neutral-200">
          <p className="-translate-y-[2px]">+</p>
        </div>
      </div>
      <p className="flex h-[35px] items-center justify-center">
        Add an account
      </p>
    </div>
  );
}

export default AddUserLogin;
