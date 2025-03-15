"use client";
import { FaGithub } from "react-icons/fa6";
import Button from "../_components/Button";
import { useTransition } from "react";
import { signWithGithub } from "../_lib/auth/action";
import { LoaderIcon } from "lucide-react";

function GitHubSignInButton({ globalPending }: { globalPending: boolean }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={globalPending || isPending}
      onClick={() => {
        startTransition(() => {
          signWithGithub();
        });
      }}
      variant="secondary"
      className="flex justify-center gap-1"
      type="button"
    >
      {!isPending && <FaGithub size={28} />}
      
      {isPending && <LoaderIcon className="animate-spin" />}
      <span>Continue with Github</span>
    </Button>
  );
}

export default GitHubSignInButton;
