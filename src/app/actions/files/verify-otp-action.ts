"use server";
import db from "@/common/lib/db";
import { setFileAccessCookie } from "@/common/utils/cookie-utils";
import { devLogger } from "@/common/utils/dev-logger";
import generateFileAccessToken from "@/common/utils/generate-file-access-token";
import { isFileLinkExpired } from "@/common/utils/is-filelink-expired";
import { file, file_access_token, otp_password } from "@/drizzle/schema";
import { eq, and, gt } from "drizzle-orm"; // Import `gt` for checking expiration
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";


type VerifyOtpResult = {
  status: "success" | "error";
  formErrors: string[];
} | null;



export default async function verifyFileOtpAction(
  _prevState: VerifyOtpResult,
  formData: FormData
): Promise<VerifyOtpResult> {
  try {
    const otp = formData.get("otp") as string;
    const fileLink = formData.get("fileLink") as string;

    if (!otp?.trim()) {
      return {
        status: "error",
        formErrors: ["OTP is required"],
      };
    }

    if (!fileLink?.trim()) {
      return {
        status: "error",
        formErrors: ["File link is required"],
      };
    }


    const linkExpired = await isFileLinkExpired(fileLink);
    if (linkExpired) {
      return {
        status: "error",
        formErrors: ["This file link has expired or is no longer valid."],
      };
    }


    const fileData = await db.query.file.findFirst({
      where: eq(file.file_link, fileLink),
      columns: {
        file_share_link_id: true,
      },
    });


    if (!fileData?.file_share_link_id) {
      return {
        status: "error",
        formErrors: ["File not found"],
      };
    }


    const otpRecord = await db.query.otp_password.findFirst({
      where: and(
        eq(otp_password.file_share_link_id, fileData.file_share_link_id),
        eq(otp_password.password, otp.trim()),
        gt(otp_password.expires_at, new Date())
      ),
      orderBy: (otp_password, { desc }) => [desc(otp_password.created_at)],
    });


    if (!otpRecord) {
      return {
        status: "error",
        formErrors: ["Invalid or expired OTP."],
      };
    }

    const fileAccessToken = generateFileAccessToken();
    if (!fileAccessToken) {
      return {
        status: "error",
        formErrors: ["Failed to generate access token"],
      };
    }

    await db.insert(file_access_token).values({
      token: fileAccessToken,
      file_share_link_id: fileData.file_share_link_id,
      expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes access
      created_at: new Date(),
      updated_at: new Date(),
    });

    await setFileAccessCookie(fileAccessToken);

    redirect(`/f/${fileLink}/download`);
  } catch (error) {
    devLogger.error("Unexpected error in verifyFileOtpAction", error);
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
