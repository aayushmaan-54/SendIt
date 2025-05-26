"use server";
import FileAccessOtp from "@/common/emails/file-access-otp";
import db from "@/common/lib/db";
import { sendEmail } from "@/common/lib/send-email";
import checkAuth from "@/common/utils/check-auth";
import { devLogger } from "@/common/utils/dev-logger";
import generateOTP from "@/common/utils/generate-otp";
import { isFileLinkExpired } from "@/common/utils/is-filelink-expired";
import { file, otp_password } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect-error";


type SendOtpResult = {
  status: "success" | "error";
  formErrors: string[];
} | null;



export default async function sendFileOtpAction(
  _prevState: SendOtpResult,
  formData: FormData
): Promise<SendOtpResult> {
  try {
    const email = formData.get("email") as string;
    const fileLink = formData.get("fileLink") as string;

    devLogger.info("Data :", email, fileLink);

    if (!email?.trim()) {
      return {
        status: "error",
        formErrors: ["Email is required"],
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


    const session = await checkAuth();
    const userId = session?.user?.id;

    const fileData = await db.query.file.findFirst({
      where: eq(file.file_link, fileLink),
      columns: {
        file_share_link_id: true,
        name: true,
        file_protection_type: true,
        authorized_emails: true,
      },
    });

    if (!fileData?.file_share_link_id) {
      return {
        status: "error",
        formErrors: ["File not found"],
      };
    }

    if (
      fileData.file_protection_type === "otp" &&
      !(fileData.authorized_emails && fileData.authorized_emails.includes(email.trim()))
    ) {
      return {
        status: "error",
        formErrors: ["You are not authorized to access this file with this email."],
      };
    }

    const otp = generateOTP();

    if (!otp) {
      return {
        status: "error",
        formErrors: ["Failed to generate OTP."],
      };
    }

    await db.insert(otp_password).values({
      password: otp,
      email: email.trim(),
      user_id: userId,
      file_share_link_id: fileData.file_share_link_id,
      created_at: new Date(),
      expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      updated_at: new Date(),
    }).onConflictDoUpdate({
      target: [otp_password.email, otp_password.file_share_link_id],
      set: {
        password: otp,
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        updated_at: new Date(),
      },
    });

    devLogger.info("OTP Generated: ", otp);

    const emailRes = await sendEmail({
      to: email.trim(),
      subject: "Your OTP to access the file on SendIt",
      reactTemplate: FileAccessOtp({
        email: email.trim(),
        otp: otp,
      }),
    });

    if (!emailRes.success) {
      return {
        status: "error",
        formErrors: ["Failed to send OTP. Please try again later."],
      };
    }

    return {
      status: "success",
      formErrors: [],
    };
  } catch (error) {
    devLogger.error("Unexpected error", error);
    if (isRedirectError(error)) {
      throw error;
    } else {
      return {
        status: "error",
        formErrors: ["An unexpected error occurred. Please try again later."],
      };
    }
  }
}
