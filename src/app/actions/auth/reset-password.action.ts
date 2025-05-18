"use server";
import { auth } from "@/common/lib/auth";
import { devLogger } from "@/common/utils/dev-logger";
import { resetPasswordSchema } from "@/common/validations/auth.schema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";


export default async function resetPasswordAction(
  _prevState: SubmissionResult | null,
  formData: FormData
) {
  const submission = parseWithZod(formData, {
    schema: resetPasswordSchema,
  });

  if (submission.status !== 'success') {
    devLogger.error("Validation failed", submission.error);
    return submission.reply();
  }

  try {
    const { password, confirmPassword } = submission.value;

    if (password !== confirmPassword) {
      return submission.reply({
        formErrors: ["Passwords do not match"],
      });
    }

    const token = formData.get("token") as string;

    if (!token) {
      devLogger.error("Token not found in form data");
      return submission.reply({
        formErrors: ["Invalid Password reset URL."],
      });
    }

    await auth.api.resetPassword({
      headers: await headers(),
      body: {
        newPassword: password,
        token,
      },
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
