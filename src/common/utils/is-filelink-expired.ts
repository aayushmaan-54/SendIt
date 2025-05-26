import db from "../lib/db";
import { eq, sql } from "drizzle-orm";
import {
  file,
  file_share_link,
  file_download_tracking
} from "@/drizzle/schema";
import uploadFileConfig from "../config/upload-file-config";


async function getFileExpirationType(fileShareLink: string) {
  const lowerCaseFileShareLink = fileShareLink.toLowerCase();

  const result = await db
    .select({
      file_expiration_type: file.file_expiration_type
    })
    .from(file_share_link)
    .innerJoin(file, eq(file.file_share_link_id, file_share_link.id))
    .where(eq(sql`lower(${file_share_link.file_share_link})`, lowerCaseFileShareLink))
    .limit(1);

  return result[0]?.file_expiration_type;
}



export async function isFileLinkExpired(
  fileShareLink: string
): Promise<boolean> {
  const lowerCaseFileShareLink = fileShareLink.toLowerCase();

  const fileExpirationType = await getFileExpirationType(fileShareLink);

  const shareLink = await db.query.file_share_link.findFirst({
    where: eq(sql`lower(${file_share_link.file_share_link})`, lowerCaseFileShareLink),
    columns: { id: true }
  });

  if (!shareLink) throw new Error("Share link not found");

  const fileData = await db.query.file.findFirst({
    where: eq(file.file_share_link_id, shareLink.id),
    columns: {
      created_at: true,
      expiration_value: true
    }
  });

  if (!fileData) throw new Error("File not found");

  let downloadCount = 0;
  if (
    fileExpirationType === uploadFileConfig.fileExpirationType.DOWNLOAD_LIMIT ||
    fileExpirationType === uploadFileConfig.fileExpirationType.ONE_TIME_DOWNLOAD
  ) {
    const tracking = await db.query.file_download_tracking.findMany({
      where: eq(file_download_tracking.file_share_link_id, shareLink.id),
      columns: { download_count: true }
    });
    downloadCount = tracking.reduce((sum, t) => sum + (t.download_count || 0), 0);
  }

  const currentDate = new Date();


  switch (fileExpirationType) {
    case uploadFileConfig.fileExpirationType.TIME:
      const expirationDate = new Date(fileData.created_at);
      expirationDate.setHours(expirationDate.getHours() + fileData.expiration_value);
      return currentDate > expirationDate;

    case uploadFileConfig.fileExpirationType.DOWNLOAD_LIMIT:
      return downloadCount >= fileData.expiration_value;

    case uploadFileConfig.fileExpirationType.ONE_TIME_DOWNLOAD:
      return downloadCount > 0;

    default:
      return false;
  }
}
