import { toast } from "sonner";
import { sendEmailVerification } from "../_lib/auth/action";
import { VscLoading } from "react-icons/vsc";
import { useState, useTransition } from "react";

function ResendEmailVerif({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const [isPendingLink, startTransition] = useTransition();
  const [isCooldownLink, setIsCooldownLink] = useState(false);
  return (
    <button
      disabled={isPendingLink || isCooldownLink || email === "" || !email}
      onClick={() => {
        startTransition(() => {
          sendEmailVerification(email).then((data) => {
            if (data.success) {
              toast.success(data.message);
              setIsCooldownLink(true);
              setTimeout(() => setIsCooldownLink(false), 60000);
            } else {
              toast.error(data.message);
            }
          });
        });
      }}
      className="flex cursor-pointer items-center gap-2 font-semibold underline disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
      {(isPendingLink || isCooldownLink) && (
        <VscLoading className="animate-spin opacity-65" size={22} />
      )}
    </button>
  );
}

export default ResendEmailVerif;
