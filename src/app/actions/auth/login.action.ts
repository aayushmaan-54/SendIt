"use server";
import { auth } from "@/common/lib/auth";
import { devLogger } from "@/common/utils/dev-logger";
import { loginSchema } from "@/common/validations/auth.schema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";


export default async function loginAction(
  _prevState: SubmissionResult | null,
  formData: FormData
) {
  const submission = parseWithZod(formData, {
    schema: loginSchema,
  });

  if (submission.status !== 'success') {
    devLogger.error("Validation failed", submission.error);
    return submission.reply();
  }

  try {
    const { email, password } = submission.value;

    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email,
        password,
      },
    });

    return submission.reply();
  } catch (error) {
    if (error instanceof APIError) {
      devLogger.error("API error", error);
      const errCode = error.body ? (error.body.code) : "UNKNOWN";

      switch (error.status) {
        case "UNAUTHORIZED":
          return submission.reply({
            formErrors: ["User not found."],
          });
        case "BAD_REQUEST":
          return submission.reply({
            formErrors: ["Invalid email."],
          });
        default:
          if (errCode === "EMAIL_NOT_VERIFIED") {
            return submission.reply({
              formErrors: ["Email not verified."],
            });
          } else {
            return submission.reply({
              formErrors: [error.message],
            });
          }
      }
    };
    devLogger.error("Unexpected error", error);
    return submission.reply({
      formErrors: ["An unexpected error occurred. Please try again later."],
    });
  }
}
