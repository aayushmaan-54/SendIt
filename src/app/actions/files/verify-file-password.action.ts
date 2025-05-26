"use server";
import db from "@/common/lib/db";
import { setFileAccessCookie } from "@/common/utils/cookie-utils";
import { devLogger } from "@/common/utils/dev-logger";
import generateFileAccessToken from "@/common/utils/generate-file-access-token";
import { file, file_access_token } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";


type VerifyFilePasswordResult = {
  status: string;
  formErrors: string[]
} | null;


export default async function verifyFilePasswordAction(
  _prevState: VerifyFilePasswordResult,
  formData: FormData
): Promise<VerifyFilePasswordResult> {
  try {
    const password = formData.get("password") as string;
    const fileLink = formData.get("fileLink") as string;


    if (!password) {
      return {
        status: "error",
        formErrors: ["Password is are required"],
      };
    }


    if (!fileLink) {
      return {
        status: "error",
        formErrors: ["Something went wrong"],
      };
    }


    const fileData = await db.query.file.findFirst({
      where: eq(file.file_link, fileLink),
      columns: {
        file_protection_type: true,
        password_hash: true,
        file_share_link_id: true,
      },
    });


    if (!fileData) {
      return {
        status: "error",
        formErrors: ["File not found"],
      };
    }


    if (fileData.file_protection_type !== "password") {
      return {
        status: "error",
        formErrors: ["File is not password protected"],
      };
    }


    if (!fileData.password_hash) {
      return {
        status: "error",
        formErrors: ["Something went wrong"],
      };
    }


    const isPasswordValid = password === fileData.password_hash;
    if (!isPasswordValid) {
      return {
        status: "error",
        formErrors: ["Invalid password"],
      };
    }


    if (isPasswordValid) {
      const fileAccessToken = generateFileAccessToken();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await db.insert(file_access_token).values({
        token: fileAccessToken,
        file_share_link_id: fileData.file_share_link_id,
        expires_at: expiresAt,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await setFileAccessCookie(fileAccessToken);
      redirect(`/f/${fileLink}/download`);
    }

    return null;
  } catch (error) {
    devLogger.error("Unexpected error", error);
    if (isRedirectError(error)) {
      throw error;
    } else {
      return {
        status: "error",
        formErrors: ["An unexpected error occurred. Please try again later."]
      };
    }
  }
}
