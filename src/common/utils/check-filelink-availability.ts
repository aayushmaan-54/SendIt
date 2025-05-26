import { eq, sql } from "drizzle-orm";
import db from "../lib/db";
import { isFileLinkExpired } from "./is-filelink-expired";
import { file_share_link } from "@/drizzle/schema";
import { devLogger } from "./dev-logger";


type FileLinkAvailabilityResult = {
  exists: boolean;
  isExpired: boolean;
  message: string;
};



export default async function checkFileLinkAvailability(fileLink: string): Promise<FileLinkAvailabilityResult> {
  try {
    const lowerCaseFileLink = fileLink.toLowerCase().trim();

    const shareLinkRecord = await db.query.file_share_link.findFirst({
      where: eq(sql`lower(${file_share_link.file_share_link})`, lowerCaseFileLink),
      columns: { id: true },
    });

    if (!shareLinkRecord) {
      return {
        exists: false,
        isExpired: false,
        message: "File link does not exist.",
      };
    }

    const expired = await isFileLinkExpired(fileLink);

    if (expired) {
      devLogger.log("File link expired:", fileLink);
      return {
        exists: true,
        isExpired: true,
        message: "File link exists but has expired.",
      };
    } else {
      return {
        exists: true,
        isExpired: false,
        message: "File link is active.",
      };
    }
  } catch (error) {
    console.error("Error in checkFileLinkAvailability:", error);
    return {
      exists: false,
      isExpired: true,
      message: "An error occurred while checking file link availability.",
    };
  }
}
