"use client";
import loginAction from '@/app/actions/auth/login.action';
import Icons from '@/common/icons/icons';
import authClient from '@/common/lib/auth-client';
import { devLogger } from '@/common/utils/dev-logger';
import { loginSchema } from '@/common/validations/auth.schema';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ErrorContext } from 'better-auth/react';
import Form from 'next/form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import toast from 'react-hot-toast';


export default function LoginForm() {
  const [lastResult, action, isPending] = useActionState(loginAction, null);
  const [requestPending, setRequestPending] = useState(false);
  const router = useRouter();

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: loginSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });


  useEffect(() => {
    if (lastResult && lastResult.status === "success") {
      router.push(process.env.NEXT_PUBLIC_AUTH_REDIRECT!);
      toast.success("Logged in successfully!");
    }
    if (lastResult && form.errors && form.errors.includes("Email not verified.")) {
      toast.error("We have sent you a verification email. Please check your inbox.");
      return;
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
            <h2 className="text-primary-text text-xl font-bold">Sign In to SendIt</h2>
            <p className="text-muted-text text-sm">Welcome back! Sign in to continue</p>
          </div>

          <div className='flex items-center gap-4 w-full border-b border-border border-dashed pb-6 mb-2'>
            <button
              type="button"
              className='flex items-center justify-center gap-2 w-full button'
              onClick={handleGoogleLogin}
              disabled={isPending || requestPending}
            >
              <Icons.Google className='size-4' />
              <span>Google</span>
            </button>

            <button
              type="button"
              className='flex items-center justify-center gap-2 w-full button'
              onClick={handleGitHubLogin}
              disabled={isPending || requestPending}
            >
              <Icons.GitHub className='size-4' />
              <span>GitHub</span>
            </button>
          </div>

          <div className="w-full space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm">Email</label>
              <input
                type="email"
                name={fields.email.name}
                key={fields.email.key}
                defaultValue={fields.email.initialValue}
                disabled={isPending || requestPending}
                id="email"
                className='w-full input'
              />
              {fields.email.errors && (
                <p className="error-text">{fields.email.errors.join(", ")}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm">Password</label>
                <Link href={'/forgot-password'} className="text-sm hover:underline">
                  Forgot your Password?
                </Link>
              </div>
              <input
                type="password"
                name={fields.password.name}
                key={fields.password.key}
                defaultValue={fields.password.initialValue}
                disabled={isPending || requestPending}
                id="password"
                className='w-full input'
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
            {isPending ? "Signing in..." : "Sign In"}
          </button>

          <div className="w-full text-center">
            <p className="text-sm">Don&apos;t have an account? <Link href={'/sign-up'} className="hover:underline">Create account</Link></p>
          </div>
        </Form>
      </div>
    </>
  );
}
