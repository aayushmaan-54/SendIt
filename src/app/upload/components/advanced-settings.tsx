/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomRadio from '@/common/components/custom-radio';
import uploadFileConfig from '@/common/config/upload-file-config';
import { AdvancedSettingsProps, AdvancedSettingsState } from '@/common/types/files';
import { getOrCreateSlug } from '@/common/utils/url-slug';
import { useEffect } from 'react';
import toast from 'react-hot-toast';


export default function AdvancedSettings({
  fileAdvancedSettings,
  onConfigChange,
  advancedSettingsField,
  isPending,
}: AdvancedSettingsProps) {
  const updateSetting = (key: keyof AdvancedSettingsState, value: any) => {
    onConfigChange({ [key]: value });
  };


  useEffect(() => {
    if (fileAdvancedSettings.linkType === 'custom' && !fileAdvancedSettings.fileLink) {
      updateSetting('fileLink', fileAdvancedSettings.fileLink);
    }
  }, [fileAdvancedSettings.linkType, fileAdvancedSettings.fileLink, updateSetting]);


  const generateSlug = () => {
    const urlInputValue = fileAdvancedSettings.fileLink;
    return getOrCreateSlug(urlInputValue);
  }


  const generateLinkFields = advancedSettingsField.generateLink.getFieldset?.();
  const fileExpiryFields = advancedSettingsField.fileExpiry.getFieldset?.();
  const fileProtectionFields = advancedSettingsField.fileProtection.getFieldset?.();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof AdvancedSettingsState) => {
    if (key === 'expirationValue') {
      e.preventDefault();
      e.stopPropagation();
      updateSetting(key, parseInt(e.target.value) || 0);
    } else if (key === 'fileLink') {
      const value = e.target.value;
      if (value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
        toast.error('Link can only contain lowercase letters, numbers, and hyphens');
        return;
      }
      updateSetting(key, value);
    } else {
      updateSetting(key, e.target.value);
    }
  };


  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const emails = rawValue.split(',').map(email => email.trim()).filter(email => email);
    updateSetting('providedEmails', emails);
  };


  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.type === 'number') {
      e.preventDefault();
      e.stopPropagation();
    }
  };


  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };


  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 rounded-lg shadow">
      <div className="space-y-4 border-b border-border pb-6">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <span className="text-xl font-semibold">🔗 Generate Link: </span>
        </h3>
        <div className="space-y-2">
          <CustomRadio
            name="linkType"
            isPending={isPending}
            label="Normal Link"
            value={uploadFileConfig.linkType.NORMAL}
            checked={fileAdvancedSettings.linkType === uploadFileConfig.linkType.NORMAL}
            onChange={() => updateSetting('linkType', uploadFileConfig.linkType.NORMAL)}
          />
          <CustomRadio
            name="linkType"
            isPending={isPending}
            label="Friendly Link"
            value={uploadFileConfig.linkType.FRIENDLY}
            checked={fileAdvancedSettings.linkType === uploadFileConfig.linkType.FRIENDLY}
            onChange={() => updateSetting('linkType', uploadFileConfig.linkType.FRIENDLY)}
          />
          <CustomRadio
            name="linkType"
            isPending={isPending}
            label="Custom Link"
            value={uploadFileConfig.linkType.CUSTOM}
            checked={fileAdvancedSettings.linkType === uploadFileConfig.linkType.CUSTOM}
            onChange={() => updateSetting('linkType', uploadFileConfig.linkType.CUSTOM)}
          />

          {fileAdvancedSettings.linkType === uploadFileConfig.linkType.CUSTOM && (
            <div className="ml-7 mt-3 p-3 w-full">
              <input
                type="text"
                disabled={isPending}
                value={fileAdvancedSettings.fileLink}
                onChange={(e) => handleInputChange(e, 'fileLink')}
                onKeyDown={handleInputKeyDown}
                className="input"
                placeholder="your-custom-link"
              />
              {generateLinkFields?.fileLink.errors && (
                <p className="error-text">{generateLinkFields.fileLink.errors.join(", ")}</p>
              )}
              <div className='flex flex-col gap-2 mt-3'>
                <button
                  type="button"
                  disabled={isPending}
                  className="button-accent"
                  onClick={(e) => handleButtonClick(e, () => {
                    // server action to check availability
                  })}
                >
                  Check Availability
                </button>

                <button
                  type='button'
                  disabled={isPending}
                  className="button"
                  onClick={(e) => handleButtonClick(e, () => {
                    const slug = generateSlug();
                    updateSetting('fileLink', slug);
                    toast.success('Slug generated successfully');
                  })}
                >
                  Generate Slug
                </button>
              </div>
            </div>
          )}
          {advancedSettingsField.generateLink.errors && (
            <p className="error-text">{advancedSettingsField.generateLink.errors.join(", ")}</p>
          )}
        </div>
      </div>

      <div className="space-y-4 border-b border-border pb-6">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <span className="text-xl font-semibold">⏳ File Expiry Control</span>
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <CustomRadio
              name="fileExpirationType"
              isPending={isPending}
              label="Time in Hours"
              value="time"
              checked={fileAdvancedSettings.fileExpirationType === uploadFileConfig.fileExpirationType.TIME}
              onChange={() => {
                updateSetting('fileExpirationType', uploadFileConfig.fileExpirationType.TIME);
                updateSetting('expirationValue', uploadFileConfig.fileExpirationTime.default);
              }}
            />
            {fileAdvancedSettings.fileExpirationType === uploadFileConfig.fileExpirationType.TIME && (
              <div className="ml-7 mt-2 mb-3">
                <input
                  type="number"
                  id="expirationValueTime"
                  disabled={isPending}
                  value={fileAdvancedSettings.expirationValue}
                  onChange={(e) => handleInputChange(e, 'expirationValue')}
                  onKeyDown={handleInputKeyDown}
                  min={uploadFileConfig.fileExpirationTime.min}
                  max={uploadFileConfig.fileExpirationTime.max}
                  className="input w-auto"
                />
                {fileExpiryFields?.expirationValue.errors && (
                  <p className="error-text">{fileExpiryFields.expirationValue.errors.join(", ")}</p>
                )}
                <p className='text-xs font-semibold text-muted-text mt-2'>
                  File will expire after the specified hours
                </p>
              </div>
            )}

            <CustomRadio
              name="fileExpirationType"
              isPending={isPending}
              label="Download Limit"
              value="download"
              checked={fileAdvancedSettings.fileExpirationType === uploadFileConfig.fileExpirationType.DOWNLOAD_LIMIT}
              onChange={() => {
                updateSetting('fileExpirationType', uploadFileConfig.fileExpirationType.DOWNLOAD_LIMIT);
                updateSetting('expirationValue', uploadFileConfig.fileExpirationDownloadLimit.default);
              }}
            />
            {fileAdvancedSettings.fileExpirationType === uploadFileConfig.fileExpirationType.DOWNLOAD_LIMIT && (
              <div className="ml-7 mt-2 mb-3">
                <input
                  type="number"
                  id="expirationValueDownloadLimit"
                  disabled={isPending}
                  value={fileAdvancedSettings.expirationValue}
                  onChange={(e) => handleInputChange(e, 'expirationValue')}
                  onKeyDown={handleInputKeyDown}
                  min={uploadFileConfig.fileExpirationDownloadLimit.min}
                  max={uploadFileConfig.fileExpirationDownloadLimit.max}
                  className="input w-auto"
                />
                {fileExpiryFields?.expirationValue.errors && (
                  <p className="error-text">{fileExpiryFields.expirationValue.errors.join(", ")}</p>
                )}
                <p className='text-xs font-semibold text-muted-text mt-2'>
                  File will expire after the specified number of downloads
                </p>
              </div>
            )}

            <CustomRadio
              name="fileExpirationType"
              isPending={isPending}
              label="One-time download"
              value="one-time"
              checked={fileAdvancedSettings.fileExpirationType === uploadFileConfig.fileExpirationType.ONE_TIME_DOWNLOAD}
              onChange={() => {
                updateSetting('fileExpirationType', uploadFileConfig.fileExpirationType.ONE_TIME_DOWNLOAD);
                updateSetting('expirationValue', 1);
              }}
            />
            {fileAdvancedSettings.fileExpirationType === uploadFileConfig.fileExpirationType.ONE_TIME_DOWNLOAD && (
              <p className='text-xs font-semibold text-muted-text ml-7 mt-1'>
                File will be deleted after first download
              </p>
            )}
            {advancedSettingsField.fileExpiry.errors && (
              <p className="error-text">{advancedSettingsField.fileExpiry.errors.join(", ")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 border-b border-border pb-6">
        <h3 className="text-lg font-medium items-center gap-2">
          <span className="text-xl font-semibold">🔒 Advanced File Protection</span>
        </h3>

        <div className="space-y-2">
          <CustomRadio
            name="fileProtectionType"
            isPending={isPending}
            label="Public"
            value="public"
            checked={fileAdvancedSettings.fileProtectionType === uploadFileConfig.fileProtectionType.PUBLIC}
            onChange={() => updateSetting('fileProtectionType', uploadFileConfig.fileProtectionType.PUBLIC)}
          />
          <CustomRadio
            name="fileProtectionType"
            isPending={isPending}
            label="File Password"
            value={uploadFileConfig.fileProtectionType.PASSWORD}
            checked={fileAdvancedSettings.fileProtectionType === uploadFileConfig.fileProtectionType.PASSWORD}
            onChange={() => updateSetting('fileProtectionType', uploadFileConfig.fileProtectionType.PASSWORD)}
          />
          <CustomRadio
            name="fileProtectionType"
            isPending={isPending}
            label="Email Protected"
            value="email"
            checked={fileAdvancedSettings.fileProtectionType === uploadFileConfig.fileProtectionType.EMAIL}
            onChange={() => updateSetting('fileProtectionType', uploadFileConfig.fileProtectionType.EMAIL)}
          />
          <CustomRadio
            name="fileProtectionType"
            isPending={isPending}
            label="OTP Protected"
            value="otp"
            checked={fileAdvancedSettings.fileProtectionType === uploadFileConfig.fileProtectionType.OTP}
            onChange={() => updateSetting('fileProtectionType', uploadFileConfig.fileProtectionType.OTP)}
          />
          {fileAdvancedSettings.fileProtectionType === uploadFileConfig.fileProtectionType.OTP && (
            <div className="ml-7 mt-2 mb-3">
              <input
                type="text"
                disabled={isPending}
                value={fileAdvancedSettings.providedEmails?.join(', ') || ''}
                onChange={handleEmailInputChange}
                placeholder="Enter email addresses separated by commas"
                className="input"
              />
              {fileProtectionFields?.providedEmails.errors && (
                <p className="error-text">{fileProtectionFields.providedEmails.errors.join(", ")}</p>
              )}
              <p className='text-xs font-semibold text-muted-text mt-2'>
                Only the listed emails will be able to access this file
              </p>
            </div>
          )}

          {fileAdvancedSettings.fileProtectionType === uploadFileConfig.fileProtectionType.PASSWORD && (
            <div className="ml-7 mt-2 mb-3">
              <input
                type="text"
                disabled={isPending}
                value={fileAdvancedSettings.password}
                onChange={(e) => handleInputChange(e, 'password')}
                onKeyDown={handleInputKeyDown}
                placeholder="Enter password"
                className="input"
              />
              {fileProtectionFields?.password.errors && (
                <p className="error-text">{fileProtectionFields.password.errors.join(", ")}</p>
              )}
              <p className='text-xs font-semibold text-muted-text mt-2'>
                File will require this password to access
              </p>
            </div>
          )}

          {fileAdvancedSettings.fileProtectionType === uploadFileConfig.fileProtectionType.EMAIL && (
            <div className="ml-7 mt-2 mb-3">
              <input
                type="text"
                disabled={isPending}
                value={fileAdvancedSettings.providedEmails?.join(', ') || ''}
                onChange={handleEmailInputChange}
                placeholder="Enter email addresses separated by commas"
                className="input"
              />
              {fileProtectionFields?.providedEmails.errors && (
                <p className="error-text">{fileProtectionFields.providedEmails.errors.join(", ")}</p>
              )}
              <p className='text-xs font-semibold text-muted-text mt-2'>
                Only the listed emails will be able to access this file
              </p>
            </div>
          )}
          {advancedSettingsField.fileProtection.errors && (
            <p className="error-text">{advancedSettingsField.fileProtection.errors.join(", ")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
