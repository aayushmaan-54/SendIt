"use client";
import resetPasswordAction from "@/app/actions/auth/reset-password.action";
import { devLogger } from "@/common/utils/dev-logger";
import { resetPasswordSchema } from "@/common/validations/auth.schema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Form from "next/form";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";


export default function ResetPasswordForm({
  token,
  callbackURL,
}: {
  token: string;
  callbackURL: string;
}) {
  const [lastResult, action, isPending] = useActionState(resetPasswordAction, null);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: resetPasswordSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });


  useEffect(() => {
    devLogger.error("Error in form submission", lastResult, form.errors);
    if (form.errors && form.errors.length > 0) {
      toast.error(form.errors.join(", "));
      return;
    }

    if (lastResult && !form.errors) {
      toast.success("Password Reset Successfully!");
      redirect(callbackURL);
    }
  }, [lastResult, form.errors, callbackURL]);

  return (
    <Form
      action={action}
      id={form.id}
      onSubmit={form.onSubmit}
      className='mt-32 max-w-lg w-full flex flex-col items-start justify-center gap-4 p-8'
    >
      <h1 className="text-2xl sm:text-4xl mb-1 font-bold">📤 Forgot Password</h1>

      <div className="w-full space-y-4">
        <input type="hidden" name="token" value={token} disabled={isPending} />
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm">New Password</label>
          <input
            type="password"
            name={fields.password.name}
            key={fields.password.key}
            defaultValue={fields.password.initialValue}
            disabled={isPending}
            id="password"
            className='w-full input'
          />
          {fields.password.errors && (
            <p className="error-text">{fields.password.errors.join(", ")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-sm">Confirm Password</label>
          <input
            type="password"
            name={fields.confirmPassword.name}
            key={fields.confirmPassword.key}
            defaultValue={fields.confirmPassword.initialValue}
            disabled={isPending}
            id="confirmPassword"
            className='w-full input'
          />
          {fields.confirmPassword.errors && (
            <p className="error-text">{fields.confirmPassword.errors.join(", ")}</p>
          )}
        </div>

        <button
          disabled={isPending}
          type="submit"
          className='button-invert w-full'
        >
          {isPending ? "Resetting Password..." : "Reset Password"}
        </button>
      </div>
    </Form>
  )
}
