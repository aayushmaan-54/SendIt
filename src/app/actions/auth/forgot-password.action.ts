"use server";
import { auth } from "@/common/lib/auth";
import { devLogger } from "@/common/utils/dev-logger";
import { forgotPasswordSchema } from "@/common/validations/auth.schema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";


export default async function forgotPasswordAction(
  _prevState: SubmissionResult | null,
  formData: FormData
) {
  const submission = parseWithZod(formData, {
    schema: forgotPasswordSchema,
  });

  if (submission.status !== 'success') {
    devLogger.error("Validation failed", submission.error);
    return submission.reply();
  }

  try {
    const { email } = submission.value;

    await auth.api.forgetPassword({
      headers: await headers(),
      body: { email },
    });

    return submission.reply();
  } catch (error) {
    if (error instanceof APIError) {
      devLogger.error("API error", error);
      return submission.reply({
        formErrors: [error.message],
      });
    }

    devLogger.error("Unexpected error", error);
    return submission.reply({
      formErrors: ["An unexpected error occurred. Please try again later."],
    });
  };
}
