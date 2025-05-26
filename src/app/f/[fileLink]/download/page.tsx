"use server";
import { and, eq, lte, sql } from "drizzle-orm";
import db from "@/common/lib/db";
import { file, file_access_token, file_download_tracking, file_share_link } from "@/drizzle/schema";
import { notFound, redirect } from "next/navigation";
import CopyLinkButton from "./components/copy-button";
import { isFileLinkExpired } from "@/common/utils/is-filelink-expired";
import { devLogger } from "@/common/utils/dev-logger";
import FilePreview from "./components/file-preview";
import { getFileType } from "@/common/utils/file-utils";
import cn from "@/common/utils/cn";
import DownloadZipButton from "./components/download-zip-button";
import { getFileProtectionType } from "../page";
import uploadFileConfig from "@/common/config/upload-file-config";
import { getFileAccessCookie } from "@/common/utils/cookie-utils";
import toast from "react-hot-toast";
import { headers } from 'next/headers';



export default async function DownloadFilePage({ params }: Readonly<{
  params: Promise<{ fileLink: string }>
}>) {
  const { fileLink } = await params;

  let isLinkActive = false;
  try {
    const expired = await isFileLinkExpired(fileLink);
    isLinkActive = !expired;
  } catch (error) {
    if (error instanceof Error && error.message === "Share link not found") {
      notFound();
    }
    devLogger.error("Error checking link expiry/existence:", error);
    notFound();
  }


  if (!isLinkActive) {
    return (
      <div className="flex flex-col items-center mt-42 justify-center text-center p-4">
        <h1 className="text-4xl font-extrabold text-danger mb-6">Link Expired or Invalid</h1>
        <p className="text-lg font-semibold text-muted-text mb-8 max-w-2xl">
          The file link you are trying to access does not exist or has expired.
        </p>
      </div>
    );
  }


  const shareLinkRecord = await db.query.file_share_link.findFirst({
    where: eq(sql`lower(${file_share_link.file_share_link})`, fileLink.toLowerCase()),
    columns: { id: true },
  });

  if (!shareLinkRecord) {
    notFound();
  }

  const files = await db.query.file.findMany({
    where: eq(file.file_share_link_id, shareLinkRecord.id),
  });

  if (!files || files.length === 0) {
    notFound();
  }

  const shareableLink = `${process.env.NEXT_PUBLIC_SITE_URL}/files/share/${fileLink}`;


  const fileProtectionType = await getFileProtectionType(fileLink);
  if (fileProtectionType !== uploadFileConfig.fileProtectionType.PUBLIC) {
    const fileAccessCookie = await getFileAccessCookie();

    if (fileAccessCookie?.value) {
      const fileAccessToken = await db.query.file_access_token.findFirst({
        where: and(
          eq(sql`lower(${file_access_token.token})`, fileAccessCookie.value.toLowerCase()),
          lte(file_access_token.expires_at, new Date())
        ),
        columns: { token: true },
      });

      if (!fileAccessToken) {
        devLogger.info("File access token not found or expired, redirecting to file link page");
        toast.error("Your access has expired. Please verify again.");
        redirect(`/f/${fileLink}`);
      }
    } else {
      devLogger.info("File access cookie not found, redirecting to file link page");
      notFound();
    }
  }


  try {
    const headerList = await headers();
    const ipAddress = headerList.get('x-forwarded-for') || headerList.get('x-real-ip') || 'N/A';
    const userAgent = headerList.get('user-agent') || 'N/A';

    await db.insert(file_download_tracking).values({
      file_share_link_id: shareLinkRecord.id,
      visit_count: 1,
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date(),
      updated_at: new Date(),
    }).onConflictDoUpdate({
      target: [file_download_tracking.file_share_link_id, file_download_tracking.ip_address],
      set: {
        visit_count: sql`${file_download_tracking.visit_count} + 1`,
        updated_at: new Date(),
      }
    });

    devLogger.info("File download tracking record inserted/updated successfully.");
  } catch (error) {
    devLogger.error("Error inserting/updating file download tracking record:", error);
  }


  return (
    <div className="flex flex-col items-center justify-center mt-28 text-center p-4">
      <h1 className="text-4xl font-extrabold italic mb-2">Download File(s)</h1>

      <p className="text-sm text-muted-text/40 font-black max-w-2xl block mt-2 mb-8">
        For very large files, it might take a few extra minutes for the file to be fully accessible on our servers.
        If your download doesn&apos;t start immediately or fails, please try again in a few moments.
      </p>


      {files.length > 1 && (<DownloadZipButton files={files} />)}


      <h1 className="text-xl font-extrabold italic mr-auto">Download File(s) Separately</h1>
      <div className="relative rounded-lg border border-border w-full h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent mt-2">
        {files.map((f, index) => (
          <div key={f.id} className={cn(index !== files.length - 1 && 'border-b border-border')}>
            <FilePreview
              key={f.id}
              file={{
                name: f.name,
                type: getFileType(f.name),
                size: f.size,
              }}
              fileUrl={f.uploadThingUrl}
            />
          </div>
        ))}

      </div>
      <CopyLinkButton
        shareableLink={shareableLink}
        className="button-accent mt-7 mb-12"
      />
    </div>
  );
}
