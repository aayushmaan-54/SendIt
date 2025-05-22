import { FieldMetadata } from "@conform-to/react";
import { AdvancedSettingsInput } from "../validations/file-upload.schema";



export interface DropzoneProps {
  onFilesAdded: (files: FileList | null) => void;
  isUploading: boolean;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}


export interface FileWithPreview extends File {
  id: string;
  fileBlobURL: string;
}


export interface FilePreviewProps {
  file: FileWithPreview;
  onRemove: () => void;
  isUploading: boolean;
}


export type LinkType = 'normal' | 'friendly' | 'custom';
export type FileExpirationType = 'time' | 'downloadLimit' | 'oneTimeDownload';
export type FileProtectionType = 'public' | 'password' | 'email' | 'otp';


export interface AdvancedSettingsState {
  linkType: LinkType;
  fileLink?: string;
  fileExpirationType: FileExpirationType;
  expirationValue?: number;
  fileProtectionType: FileProtectionType;
  providedEmails?: string[];
  password?: string;
}


type AdvancedSettingsFields = {
  [K in keyof AdvancedSettingsInput]: FieldMetadata<AdvancedSettingsInput[K]> & {
    getFieldset?: () => {
      [N in keyof AdvancedSettingsInput[K]]?: FieldMetadata<AdvancedSettingsInput[K][N]>
    }
  };
};


export interface AdvancedSettingsProps {
  fileAdvancedSettings: AdvancedSettingsState;
  onConfigChange: (config: Partial<AdvancedSettingsState>) => void;
  advancedSettingsField: AdvancedSettingsFields;
  isPending: boolean;
}
