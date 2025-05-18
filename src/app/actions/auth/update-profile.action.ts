"use server";
import { auth } from "@/common/lib/auth";
import { devLogger } from "@/common/utils/dev-logger";
import { updateProfileSchema } from "@/common/validations/auth.schema";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";


export default async function updateProfileAction(
  _prevState: SubmissionResult | null,
  formData: FormData
) {
  const submission = parseWithZod(formData, {
    schema: updateProfileSchema,
  });

  if (submission.status !== 'success') {
    devLogger.error("Validation failed", submission.error);
    return submission.reply();
  }

  try {
    const { username, profileImage } = submission.value;

    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: username,
        image: profileImage,
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
