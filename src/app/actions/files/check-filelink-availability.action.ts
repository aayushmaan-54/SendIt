"use server";
import checkFileLinkAvailability from "@/common/utils/check-filelink-availability";
import { devLogger } from "@/common/utils/dev-logger";



export default async function checkFileLinkAvailabilityAction(fileLink: string) {
  if (!fileLink || typeof fileLink !== 'string' || fileLink.trim() === '') {
    return { exists: false, isExpired: false, message: "Invalid link." };
  }

  try {
    const result = await checkFileLinkAvailability(fileLink);
    return result;
  } catch (error) {
    devLogger.error("Server Action error checking link availability:", error);
    return { exists: false, isExpired: true, message: "An error occurred while checking availability." };
  }
}
