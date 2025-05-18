"use client";
import { useForm } from '@conform-to/react';
import Icons from '@/common/icons/icons';
import Form from 'next/form';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { parseWithZod } from '@conform-to/zod';
import { signupSchema } from '@/common/validations/auth.schema';
import { toast } from 'react-hot-toast';
import signupAction from '@/app/actions/auth/sign-up.action';
import authClient from '@/common/lib/auth-client';
import { ErrorContext } from 'better-auth/react';
import { devLogger } from '@/common/utils/dev-logger';
import { useRouter } from 'next/navigation';


export default function SignUpForm() {
  const [lastResult, action, isPending] = useActionState(signupAction, null);
  const [requestPending, setRequestPending] = useState(false);
  const router = useRouter();

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: signupSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });


  useEffect(() => {
    if (lastResult && lastResult.status === "success") {
      toast.success("Account created successfully! Please check your email to verify your account.");
      return;
    }

    if (lastResult && lastResult.status === "success") {
      router.push(process.env.NEXT_PUBLIC_AUTH_REDIRECT!);
      toast.success("Signed up successfully!");
    }

    if (lastResult && form.errors) {
      devLogger.error("Error in form submission", lastResult, form.errors);
      toast.error(form.errors.join(", "));
    }
  }, [lastResult, form.errors, router]);


  const handleGoogleLogin = async () => {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: process.env.NEXT_PUBLIC_AUTH_REDIRECT!,
    }, {
      onRequest: () => {
        setRequestPending(true);
      },
      onSuccess: () => {
        setRequestPending(false);
      },
      onError: (ctx: ErrorContext) => {
        devLogger.error("Google login error", ctx.error);
        toast.error(ctx.error.message ?? "Something went wrong.");
        setRequestPending(false);
      },
    });
  }

  const handleGitHubLogin = async () => {
    authClient.signIn.social({
      provider: 'github',
      callbackURL: process.env.NEXT_PUBLIC_AUTH_REDIRECT!,
    }, {
      onRequest: () => {
        setRequestPending(true);
      },
      onSuccess: () => {
        setRequestPending(false);
      },
      onError: (ctx: ErrorContext) => {
        devLogger.error("GitHub login error", ctx.error);
        toast.error(ctx.error.message ?? "Something went wrong.");
        setRequestPending(false);
      },
    });
  }

  return (
    <>
      <div className="flex items-center justify-center mt-28 mb-7 px-2">
        <Form
          action={action}
          id={form.id}
          onSubmit={form.onSubmit}
          className='max-w-md w-full bg-secondary flex flex-col items-start justify-center gap-4 rounded-lg p-8 border border-border'
        >
          <div className="mb-2">
            <h1 className="text-2xl mb-1">📤</h1>
            <h2 className="text-primary-text text-xl font-bold">Create a SendIt Account</h2>
            <p className="text-muted-text text-sm">Welcome! Create an account to get started</p>
          </div>

          <div className='flex items-center gap-4 w-full border-b border-border border-dashed pb-6 mb-2'>
            <button
              className='flex items-center justify-center gap-2 w-full button'
              type="button"
              onClick={handleGoogleLogin}
              disabled={isPending || requestPending}
            >
              <Icons.Google className='size-4' />
              <span>Google</span>
            </button>

            <button
              className='flex items-center justify-center gap-2 w-full button'
              type="button"
              onClick={handleGitHubLogin}
              disabled={isPending || requestPending}
            >
              <Icons.GitHub className='size-4' />
              <span>GitHub</span>
            </button>
          </div>

          <div className="w-full space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-sm">Username</label>
              <input
                type="text"
                id="username"
                className='w-full input'
                name={fields.username.name}
                key={fields.username.key}
                defaultValue={fields.username.initialValue}
                disabled={isPending || requestPending}
              />
              {fields.username.errors && (
                <p className="error-text">{fields.username.errors.join(", ")}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm">Email</label>
              <input
                type="text"
                id="email"
                className='w-full input'
                name={fields.email.name}
                key={fields.email.key}
                defaultValue={fields.email.initialValue}
                disabled={isPending || requestPending}
              />
              {fields.email.errors && (
                <p className="error-text">{fields.email.errors.join(", ")}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm">Password</label>
                <Link href={''} className="text-sm hover:underline">
                  Forgot your Password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                className='w-full input'
                name={fields.password.name}
                key={fields.password.key}
                defaultValue={fields.password.initialValue}
                disabled={isPending || requestPending}
              />
              {fields.password.errors && (
                <p className="error-text">{fields.password.errors.join(", ")}</p>
              )}
            </div>
          </div>

          <button
            disabled={isPending || requestPending}
            type="submit"
            className='button-invert w-full'
          >
            {isPending ? "Signing up..." : "Sign Up"}
          </button>

          <div className="w-full text-center">
            <p className="text-sm">Have an account? <Link href={'/login'} className="hover:underline">Login</Link></p>
          </div>
        </Form>
      </div>
    </>
  );
}
