"use server";
import { eq } from "drizzle-orm";
import { file, file_share_link } from "@/drizzle/schema";
import db from "@/common/lib/db";
import { notFound, redirect } from "next/navigation";
import { devLogger } from "@/common/utils/dev-logger";
import OTP_Protection from "./components/otp-protection";
import { isFileLinkExpired } from "@/common/utils/is-filelink-expired";
import uploadFileConfig from "@/common/config/upload-file-config";
import PasswordProtection from "./components/password-protection";
import checkAuth from "@/common/utils/check-auth";
import toast from "react-hot-toast";


async function getFileLink(fileLink: string) {
  const data = await db.query.file_share_link.findFirst({
    where: eq(file_share_link.file_share_link, fileLink),
  });
  return data?.file_share_link;
}


export async function getFileProtectionType(fileShareLink: string) {
  const result = await db
    .select({
      file_protection_type: file.file_protection_type
    })
    .from(file_share_link)
    .innerJoin(file, eq(file.file_share_link_id, file_share_link.id))
    .where(eq(file_share_link.file_share_link, fileShareLink))
    .limit(1);

  return result[0]?.file_protection_type;
}



export default async function SharedPage({ params }: Readonly<{
  params: Promise<{ fileLink: string }>
}>) {
  const { fileLink } = await params;
  const fileLinkData = await getFileLink(fileLink);
  if (!fileLinkData) return notFound();

  const fileProtectionType = await getFileProtectionType(fileLink);
  devLogger.info("File Protection Type: ", fileProtectionType);
  if (!fileProtectionType) return notFound();

  if (fileProtectionType === uploadFileConfig.fileProtectionType.PUBLIC) {
    redirect(`/f/${fileLink}/download`);
  }

  const isLinkExpired = await isFileLinkExpired(fileLink);
  if (isLinkExpired) {
    devLogger.info("File link expired");
    return notFound();
  }

  if (fileProtectionType === uploadFileConfig.fileProtectionType.EMAIL) {
    const session = await checkAuth();

    if (!session) {
      toast.error("Authentication Required: This file is protected by email authorization. Please sign in with an authorized email to access it.");
      redirect(`/login`);
    }

    const userEmail = session?.user?.email;

    const isEmailAuthorized = await db.query.file.findFirst({
      where: eq(file.file_link, fileLink),
      columns: {
        authorized_emails: true,
      },
    });

    if (isEmailAuthorized?.authorized_emails?.includes(userEmail!)) {
      redirect(`/f/${fileLink}/download`);
    } else {
      return notFound();
    }
  }


  return (
    <>
      <h1 className="text-xl font-black mt-32">Loading...</h1>

      {fileProtectionType === uploadFileConfig.fileProtectionType.OTP && (
        <OTP_Protection fileLink={fileLink} />
      )}

      {fileProtectionType === uploadFileConfig.fileProtectionType.PASSWORD && (
        <PasswordProtection fileLink={fileLink} />
      )}
    </>
  );
}
