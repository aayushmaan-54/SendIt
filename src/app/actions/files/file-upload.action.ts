"use server";
import db from "@/common/lib/db";
import { UploadThingResponse } from "@/common/types/components-types";
import { devLogger } from "@/common/utils/dev-logger";
import { AdvancedSettingsInput, advancedSettingsSchema } from "@/common/validations/file-upload.schema";
import { file, FileLinkType, FileExpirationType, FileProtectionType, file_share_link } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import checkAuth from "@/common/utils/check-auth";
import { generateFriendlySlug } from "@/common/utils/url-slug";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const MAX_ALLOWED_FILES_SIZE = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB!) * 1024 * 1024;

export type ActionResult = {
  status: 'success' | 'error';
  formErrors?: string[];
  fileLink?: string;
};



export default async function fileUploadAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const uploadedFiles = JSON.parse(formData.get("uploadedFiles") as string) as UploadThingResponse;
    if (!uploadedFiles || !Array.isArray(uploadedFiles) || uploadedFiles.length === 0) {
      return {
        status: "error",
        formErrors: ["No files were uploaded"]
      };
    }

    const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize === 0) {
      return {
        status: "error",
        formErrors: ["Files cannot be empty"]
      };
    }
    if (totalSize > MAX_ALLOWED_FILES_SIZE) {
      return {
        status: "error",
        formErrors: [`Total file size exceeds ${MAX_ALLOWED_FILES_SIZE / (1024 * 1024)}MB limit`]
      };
    }

    const advancedSettings = JSON.parse(formData.get("advancedSettings") as string) as AdvancedSettingsInput;
    const validationResult = advancedSettingsSchema.safeParse(advancedSettings);

    if (!validationResult.success) {
      return {
        status: "error",
        formErrors: validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }

    devLogger.log('Files:', uploadedFiles);
    devLogger.log('Advanced Settings:', advancedSettings);

    let fileLink = '';
    if (advancedSettings.generateLink.linkType === 'custom') {
      fileLink = slugify(advancedSettings.generateLink.fileLink!, {
        lower: true,
        strict: true,
      });
    } else if (advancedSettings.generateLink.linkType === 'friendly') {
      fileLink = slugify(generateFriendlySlug(), {
        lower: true,
        strict: true,
      });
    } else {
      fileLink = nanoid(7);
    }

    const existingFile = await db.query.file.findFirst({
      where: eq(file.file_link, fileLink.toLowerCase()),
    });

    if (existingFile) {
      return {
        status: "error",
        formErrors: ["This link is already in use. Please try a different one."]
      };
    }

    const session = await checkAuth();
    const userId = session?.user?.id;


    let authorizedEmails: string[] = [];
    if (
      !session
      && advancedSettings.fileProtection.fileProtectionType === 'email'
      || advancedSettings.fileProtection.fileProtectionType === 'otp'
    ) {
      const userEmail = session?.user?.email;
      authorizedEmails = [...advancedSettings.fileProtection.providedEmails!, userEmail!];
    }


    const [newFileShareLink] = await db
      .insert(file_share_link)
      .values({
        file_share_link: fileLink.toLowerCase(),
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning();

    for (const uploadedFile of uploadedFiles) {
      await db.insert(file).values({
        name: uploadedFile.name,
        size: uploadedFile.size.toString(),
        uploadThingUrl: uploadedFile.url,
        uploadThingKey: uploadedFile.key,
        file_link_type: advancedSettings.generateLink.linkType as FileLinkType,
        file_link: fileLink.toLowerCase(),
        file_expiration_type: advancedSettings.fileExpiry.fileExpirationType as FileExpirationType,
        expiration_value: advancedSettings.fileExpiry.expirationValue,
        file_protection_type: advancedSettings.fileProtection.fileProtectionType as FileProtectionType,
        authorized_emails: advancedSettings.fileProtection.fileProtectionType === 'email' ||
          advancedSettings.fileProtection.fileProtectionType === 'otp'
          ? authorizedEmails
          : null,
        password_hash: advancedSettings.fileProtection.fileProtectionType === 'password'
          ? advancedSettings.fileProtection.password
          : null,
        user_id: userId || null,
        file_share_link_id: newFileShareLink.id,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    redirect(`/files/share/${fileLink.toLowerCase()}`);
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
