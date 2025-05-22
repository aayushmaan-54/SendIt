/* eslint-disable @typescript-eslint/no-unused-expressions */

export interface CustomRadioProps {
  name: string;
  label: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isPending?: boolean;
}


export interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  name: string;
  isPending?: boolean;
}


export interface AdvancedSettingsState {
  linkType: 'normal' | 'friendly' | 'custom';
  customLink: string;
  expiryTime: number;
  downloadLimit: number;
  oneTimeDownload: boolean;
  protection: 'no-protection' | 'email-based' | 'otp-access';
  recipientEmails: string;
}

export interface UploadThingResponse {
  name: string;
  size: number;
  key: string;
  url: string;
  serverData: Record<string, unknown> | null;
}[];
