import { z } from "zod";



export const generateLinkSchema = z.object({
  linkType: z.enum(["normal", "friendly", "custom"], {
    errorMap: () => ({ message: "Please select a valid link type" }),
  }),
  fileLink: z.string()
    .min(1, { message: "File link cannot be empty" })
    .max(2048, { message: "File link must be less than 2048 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "File link must be a valid slug (lowercase letters, numbers, and hyphens only)",
    })
    .optional()
}).superRefine((data, ctx) => {
  if (data.linkType === "custom" && !data.fileLink) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Custom link is required when custom link type is selected",
      path: ["fileLink"]
    });
  }
});


export const fileExpirySchema = z.object({
  fileExpirationType: z.enum(["time", "downloadLimit", "oneTimeDownload"], {
    errorMap: () => ({ message: "Please select an expiration type" })
  }),
  expirationValue: z.number()
}).refine((data) => {
  if (data.fileExpirationType === "time") {
    return data.expirationValue <= 720 || "Maximum time limit is 720";
  }
  if (data.fileExpirationType === "downloadLimit") {
    return data.expirationValue <= 100 || "Maximum download limit is 100";
  }
  if (data.fileExpirationType === "oneTimeDownload") {
    return data.expirationValue === 1 || "Must be set to 1 for one-time download";
  }
  return false;
});


export const fileProtectionSchema = z.discriminatedUnion("fileProtectionType", [
  z.object({
    fileProtectionType: z.literal("public"),
    providedEmails: z.undefined(),
    password: z.undefined(),
  }),
  z.object({
    fileProtectionType: z.literal("password"),
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(256, { message: "Password must be less than 256 characters" }),
    providedEmails: z.undefined(),
  }),
  z.object({
    fileProtectionType: z.literal("email"),
    providedEmails: z.array(
      z.string().email({ message: "Please enter valid email addresses" })
    )
      .min(1, { message: "At least one email is required" })
      .max(100, { message: "Maximum 100 emails allowed" }),
    password: z.undefined(),
  }),
  z.object({
    fileProtectionType: z.literal("otp"),
    providedEmails: z.array(
      z.string().email({ message: "Please enter valid email addresses" })
    )
      .min(1, { message: "At least one email is required" })
      .max(100, { message: "Maximum 100 emails allowed" }),
    password: z.undefined(),
  }),
], {
  errorMap: () => ({ message: "Invalid protection type configuration" })
});


export const advancedSettingsSchema = z.object({
  generateLink: generateLinkSchema,
  fileExpiry: fileExpirySchema,
  fileProtection: fileProtectionSchema,
}, {
  errorMap: () => ({ message: "Invalid advanced settings configuration" })
});


export const fileUploadSchema = z.object({
  advancedSettings: advancedSettingsSchema
});



export type AdvancedSettingsInput = z.infer<typeof advancedSettingsSchema>;
