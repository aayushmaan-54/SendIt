import { devLogger } from "@/common/utils/dev-logger";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import checkAuth from "@/common/utils/check-auth";


const f = createUploadthing();

const auth = async () => {
  const res = await checkAuth();
  return res?.session;
};

export const ourFileRouter = {
  imageUploader: f({
    "image/png": { maxFileSize: "4MB", maxFileCount: 1 },
    "image/jpeg": { maxFileSize: "4MB", maxFileCount: 1 },
    "image/webp": { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await auth();
      if (!user) throw new UploadThingError("Unauthorized!");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      devLogger.info("Upload complete for userId:", metadata.userId);
      devLogger.info("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
