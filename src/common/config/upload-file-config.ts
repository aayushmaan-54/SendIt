const uploadFileConfig = {
  linkType: {
    NORMAL: 'normal',
    FRIENDLY: 'friendly',
    CUSTOM: 'custom',
  } as const,
  fileExpirationType: {
    TIME: 'time',
    DOWNLOAD_LIMIT: 'downloadLimit',
    ONE_TIME_DOWNLOAD: 'oneTimeDownload',
  } as const,
  fileProtectionType: {
    PUBLIC: 'public',
    PASSWORD: 'password',
    EMAIL: 'email',
    OTP: 'otp',
  } as const,
  fileExpirationTime: {
    min: 1,
    max: 720,
    default: 24,
  },
  fileExpirationDownloadLimit: {
    min: 1,
    max: 100,
    default: 1,
  },
  fileExpirationOneTimeDownload: {
    min: 1,
    max: 1,
    default: 1,
  },
}


export default uploadFileConfig;
