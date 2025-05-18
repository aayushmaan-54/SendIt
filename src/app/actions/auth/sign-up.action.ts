"use server";
import { auth } from "@/common/lib/auth";
import { devLogger } from "@/common/utils/dev-logger";
import { signupSchema } from "@/common/validations/auth.schema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";


export default async function signupAction(
  _prevState: SubmissionResult | null,
  formData: FormData
) {
  const submission = parseWithZod(formData, {
    schema: signupSchema,
  });

  if (submission.status !== 'success') {
    devLogger.error("Validation failed", submission.error);
    return submission.reply();
  }

  try {
    const { username, email, password } = submission.value;

    await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        name: username,
        email,
        password,
      },
    });

    return submission.reply();
  } catch (error) {
    if (error instanceof APIError) {
      devLogger.error("API error", error);

      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return submission.reply({
            formErrors: ["User already exists."],
          });
        case "BAD_REQUEST":
          return submission.reply({
            formErrors: ["Invalid email."],
          });
        default:
          return submission.reply({
            formErrors: ["Something went wrong."],
          });
      }
    };
    devLogger.error("Unexpected error", error);
    return submission.reply({
      formErrors: ["An unexpected error occurred. Please try again later."],
    });
  }
}
