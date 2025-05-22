"use client";
import { useActionState, useRef, useState, useEffect } from "react";
import Dropzone from "./dropzone";
import toast from "react-hot-toast";
import Accordion from "@/common/components/accordion";
import StorageUsageProgress from "./storage-usage-progress";
import FilePreview from "./file-preview";
import { AdvancedSettingsState, FileWithPreview } from "@/common/types/files";
import Icons from "@/common/icons/icons";
import Form from "next/form";
import fileUploadAction from "@/app/actions/files/file-upload.action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import uploadFileConfig from "@/common/config/upload-file-config";
import AdvancedSettings from "./advanced-settings";
import cn from "@/common/utils/cn";
import { AdvancedSettingsInput, advancedSettingsSchema } from "@/common/validations/file-upload.schema";
import { devLogger } from "@/common/utils/dev-logger";
import { useUploadThing } from "@/common/utils/uploadthing";

const MAX_ALLOWED_FILES_SIZE = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB!) * 1024 * 1024;



export default function FileUploader() {
  const [lastResult, action, isPending] = useActionState(fileUploadAction, null);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: advancedSettingsSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [fileAdvancedSettings, setFileAdvancedSettings] = useState<AdvancedSettingsState>({
    linkType: uploadFileConfig.linkType.NORMAL,
    fileLink: '',
    fileExpirationType: uploadFileConfig.fileExpirationType.TIME,
    expirationValue: uploadFileConfig.fileExpirationTime.default,
    fileProtectionType: uploadFileConfig.fileProtectionType.PUBLIC,
    providedEmails: [],
    password: '',
  });


  const fileInputRef = useRef<HTMLInputElement>(null!);


  const { startUpload, isUploading: isUTUploading } = useUploadThing("fileUploader", {
    onClientUploadComplete: () => {
      toast.success("uploaded successfully!");
    },
    onUploadError: () => {
      toast.error("error occurred while uploading");
    },
  });


  useEffect(() => {
    setIsUploading(isUTUploading);
  }, [isUTUploading]);


  const handleFilesAdded = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileWithPreview[] = [];
    let newTotalSize = totalSize;

    Array.from(selectedFiles).forEach((file) => {
      if (newTotalSize + file.size > MAX_ALLOWED_FILES_SIZE) {
        toast.error(`Adding ${file.name} would exceed the ${process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB}MB limit.`);
        return;
      }

      const fileWithPreview: FileWithPreview = Object.assign(file, {
        id: crypto.randomUUID(),
        fileBlobURL: URL.createObjectURL(file),
      });

      newFiles.push(fileWithPreview);
      newTotalSize += file.size;
    });

    if (newFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setTotalSize(newTotalSize);
    }
  };


  const removeFile = (fileId: string) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((file) => file.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.fileBlobURL);
        const remainingFiles = prevFiles.filter((file) => file.id !== fileId);
        const newTotalSize = remainingFiles.reduce((sum, file) => sum + file.size, 0);
        setTotalSize(newTotalSize);
        return remainingFiles;
      }
      return prevFiles;
    });
  };


  const handleConfigChange = (config: Partial<AdvancedSettingsState>) => {
    setFileAdvancedSettings(prev => ({ ...prev, ...config }));
  };


  const usedPercentage = MAX_ALLOWED_FILES_SIZE > 0
    ? Number(((Math.max(0, totalSize) / MAX_ALLOWED_FILES_SIZE) * 100).toFixed(1))
    : 0;


  const submitFormAction = async () => {
    devLogger.log('Form submission triggered!');

    if (files.length === 0) {
      devLogger.log('No files to upload');
      toast.error('Please select file(s) to upload');
      return;
    }

    try {
      setIsUploading(true);

      const advancedSettings: AdvancedSettingsInput = {
        generateLink: {
          linkType: fileAdvancedSettings.linkType || uploadFileConfig.linkType.NORMAL,
          fileLink: fileAdvancedSettings.linkType === 'custom' ? fileAdvancedSettings.fileLink! : undefined
        },
        fileExpiry: {
          fileExpirationType: fileAdvancedSettings.fileExpirationType || uploadFileConfig.fileExpirationType.TIME,
          expirationValue: fileAdvancedSettings.expirationValue || uploadFileConfig.fileExpirationTime.default
        },
        fileProtection: (() => {
          switch (fileAdvancedSettings.fileProtectionType) {
            case "password":
              return {
                fileProtectionType: "password",
                password: fileAdvancedSettings.password || ''
              };
            case "email":
            case "otp":
              return {
                fileProtectionType: fileAdvancedSettings.fileProtectionType,
                providedEmails: fileAdvancedSettings.providedEmails || []
              };
            default:
              return {
                fileProtectionType: "public"
              };
          }
        })(),
      };

      const validationResult = advancedSettingsSchema.safeParse(advancedSettings);

      if (!validationResult.success) {
        devLogger.error('Form validation failed:', validationResult.error);
        const errorMessages = validationResult.error.errors
          .map(err => {
            const fieldName = err.path.join('.').replace(/([A-Z])/g, ' $1').toLowerCase();
            return `${fieldName}: ${err.message}`;
          })
          .join('\n');

        toast.error(errorMessages || 'Please check your input values');
        setIsUploading(false);
        return;
      }

      const uploadResult = await startUpload(files);

      const submitFormData = new FormData();
      submitFormData.append("uploadedFiles", JSON.stringify(uploadResult));
      submitFormData.append("advancedSettings", JSON.stringify(advancedSettings));

      action(submitFormData);

      toast.success('Upload completed successfully!');
      setFiles([]);
      setFileAdvancedSettings({
        linkType: uploadFileConfig.linkType.NORMAL,
        fileLink: '',
        fileExpirationType: uploadFileConfig.fileExpirationType.TIME,
        expirationValue: uploadFileConfig.fileExpirationTime.default,
        fileProtectionType: uploadFileConfig.fileProtectionType.PUBLIC,
        providedEmails: [],
        password: '',
      });
    } catch (error) {
      devLogger.error('Form submission error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <>
      <Form
        action={submitFormAction}
        id={form.id}
      >
        <Dropzone
          onFilesAdded={handleFilesAdded}
          isUploading={isUploading || isPending}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          fileInputRef={fileInputRef}
        />
        {files.length !== 0 && (
          <div className="w-[90vw] sm:w-[80vw] lg:w-[800px]">
            <div className="mt-5 w-full">
              <StorageUsageProgress totalSize={totalSize} usedPercentage={usedPercentage} />
              <div className="relative rounded-lg border border-border w-full h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent mt-2">
                {files.map((file, index) => (
                  <div key={file.id} className={cn(index !== files.length - 1 && 'border-b border-border')}>
                    <FilePreview
                      key={file.id}
                      file={file}
                      isUploading={isUploading}
                      onRemove={() => removeFile(file.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Accordion title="⚙️ Advanced Settings">
              <AdvancedSettings
                fileAdvancedSettings={fileAdvancedSettings}
                onConfigChange={handleConfigChange}
                advancedSettingsField={fields}
                isPending={isPending || isUploading}
              />
            </Accordion>

            <button
              className="flex items-center justify-center gap-2 w-full button-accent font-semibold mb-12"
              type="submit"
              disabled={isPending || isUploading || files.length === 0}
            >
              <Icons.Upload />
              <span className="mt-1">{isPending || isUploading ? 'Uploading...' : 'Upload'}</span>
            </button>
          </div>
        )}

        {/* Hidden inputs to prevent form auto-submission on radio changes */}
        <input type="hidden" name="linkType" value={fileAdvancedSettings.linkType} />
        <input type="hidden" name="fileLink" value={fileAdvancedSettings.fileLink} />
        <input type="hidden" name="fileExpirationType" value={fileAdvancedSettings.fileExpirationType} />
        <input type="hidden" name="expirationValue" value={fileAdvancedSettings.expirationValue} />
        <input type="hidden" name="fileProtectionType" value={fileAdvancedSettings.fileProtectionType} />
        <input type="hidden" name="password" value={fileAdvancedSettings.password} />
        <input type="hidden" name="providedEmails" value={fileAdvancedSettings.providedEmails?.join(',') || ''} />
      </Form>
    </>
  );
}
