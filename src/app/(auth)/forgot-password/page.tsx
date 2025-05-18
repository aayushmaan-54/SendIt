"use client";
import forgotPasswordAction from "@/app/actions/auth/forgot-password.action";
import { devLogger } from "@/common/utils/dev-logger";
import { forgotPasswordSchema } from "@/common/validations/auth.schema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Form from "next/form";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";


export default function ForgotPasswordPage() {
  const [lastResult, action, isPending] = useActionState(forgotPasswordAction, null);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: forgotPasswordSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });


  useEffect(() => {
    if (lastResult && form.errors) {
      devLogger.error("Error in form submission", lastResult, form.errors);
      toast.error(form.errors.join(", "));
    }

    if (lastResult && lastResult.status === "success") {
      toast.success("Password Reset email sent!");
      redirect('/login');
    }
  }, [lastResult, form.errors]);

  return (
    <>
      <Form
        action={action}
        id={form.id}
        onSubmit={form.onSubmit}
        className='mt-32 max-w-lg w-full flex flex-col items-start justify-center gap-4 p-8'
      >
        <h1 className="text-2xl sm:text-4xl mb-1 font-bold">📤 Forgot Password</h1>

        <div className="w-full space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm">Email</label>
            <input
              type="email"
              name={fields.email.name}
              key={fields.email.key}
              defaultValue={fields.email.initialValue}
              disabled={isPending}
              id="email"
              className='w-full input'
            />
            {fields.email.errors && (
              <p className="error-text">{fields.email.errors.join(", ")}</p>
            )}
          </div>

          <button
            disabled={isPending}
            type="submit"
            className='button-invert w-full'
          >
            {isPending ? "Sending reset link..." : "Send Password Reset Email"}
          </button>
        </div>
      </Form>
    </>
  );
}
