"use client";
import verifyFilePasswordAction from "@/app/actions/files/verify-file-password.action";
import Form from "next/form";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";


type VerifyFilePasswordResult = {
  status: string;
  formErrors: string[]
} | null;


export default function PasswordProtection({ fileLink }: { fileLink: string }) {
  const [state, formAction] = useFormState<VerifyFilePasswordResult, FormData>(
    verifyFilePasswordAction,
    null
  );

  const { pending } = useFormStatus();


  useEffect(() => {
    if (state?.status === 'error' && state.formErrors && state.formErrors.length > 0) {
      toast.error(state.formErrors.join(", "));
    }
  }, [state]);


  return (
    <div className="flex flex-col gap-4 mt-40 mx-auto">
      <h1 className="text-xl sm:text-4xl font-black italic mx-auto">
        <span className="not-italic">🔑 </span>
        Password Protected
      </h1>
      <Form
        action={formAction}
        className="flex flex-col items-center w-[90vw] sm:w-[500px]"
      >
        <input type="hidden" name="fileLink" value={fileLink} disabled={pending} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input h-12! text-lg! font-semibold mt-10"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending}
          className="button-accent w-full mt-5 font-black py-4! text-lg!"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}
