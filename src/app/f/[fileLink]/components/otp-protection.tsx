"use client";
import sendFileOtpAction from "@/app/actions/files/send-file-otp.action";
import verifyFileOtpAction from "@/app/actions/files/verify-otp-action";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

type SendOtpResult = {
  status: "success" | "error";
  formErrors: string[];
} | null;

type VerifyOtpResult = {
  status: "success" | "error";
  formErrors: string[];
} | null;



export default function OTP_Protection({ fileLink }: { fileLink: string }) {
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const [sendOtpState, sendOtpFormAction] = useActionState<SendOtpResult, FormData>(
    sendFileOtpAction,
    null
  );

  const [verifyOtpState, verifyOtpFormAction] = useActionState<VerifyOtpResult, FormData>(
    verifyFileOtpAction,
    null
  );


  useEffect(() => {
    if (sendOtpState?.status === 'success') {
      toast.success("OTP sent to your email");
      setEmailSubmitted(true);
    }

    if (sendOtpState?.status === 'error' && sendOtpState.formErrors && sendOtpState.formErrors.length > 0) {
      toast.error(sendOtpState.formErrors.join(", "));
    }
  }, [sendOtpState]);


  useEffect(() => {
    if (verifyOtpState?.status === 'success') {
      toast.success("OTP verified successfully");
    }

    if (verifyOtpState?.status === 'error' && verifyOtpState.formErrors && verifyOtpState.formErrors.length > 0) {
      toast.error(verifyOtpState.formErrors.join(", "));
    }
  }, [verifyOtpState]);


  function SendOtpButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="button-accent w-full mt-5 font-black py-4! text-lg!"
      >
        {pending ? "Sending OTP..." : "Send OTP"}
      </button>
    );
  }


  function VerifyOtpButton() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className="button-accent w-full mt-5 font-black py-4! text-lg!"
      >
        {pending ? "Verifying OTP..." : "Verify OTP"}
      </button>
    );
  }



  return (
    <div className="flex flex-col gap-4 mt-40 mx-auto">
      <h1 className="text-xl sm:text-4xl font-black italic mx-auto">
        <span className="not-italic">🔐 </span>
        OTP Protected
      </h1>

      {!emailSubmitted ? (
        <Form
          action={sendOtpFormAction}
          className="flex flex-col items-center w-[90vw] sm:w-[500px]"
        >
          <input type="hidden" name="fileLink" value={fileLink} />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="input h-12! text-lg! font-semibold mt-10"
            required
          />
          <SendOtpButton />
        </Form>
      ) : (
        <Form
          action={verifyOtpFormAction}
          className="flex flex-col items-center w-[90vw] sm:w-[500px]"
        >
          <input type="hidden" name="fileLink" value={fileLink} />
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            className="input h-12! text-lg! font-semibold mt-10"
            required
          />
          <VerifyOtpButton />
        </Form>
      )}
    </div>
  );
}
