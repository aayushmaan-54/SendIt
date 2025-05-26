import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  uniqueIndex
} from "drizzle-orm/pg-core";



export enum FileLinkType {
  NORMAL = "normal",
  FRIENDLY = "friendly",
  CUSTOM = "custom",
}

export enum FileExpirationType {
  TIME = "time",
  DOWNLOAD_LIMIT = "downloadLimit",
  ONE_TIME_DOWNLOAD = "oneTimeDownload",
}

export enum FileProtectionType {
  PUBLIC = "public",
  PASSWORD = "password",
  EMAIL = "email",
  OTP = "otp",
}

export enum TokenStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
}

export enum ShareStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  DISABLED = "disabled",
}


export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),

  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});


export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),

  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),

  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});


export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),

  expiresAt: timestamp('expires_at').notNull(),

  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});


export const file = pgTable("file", {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  size: text('size').notNull(),
  uploadThingUrl: text('upload_thing_url').notNull(),
  uploadThingKey: text('upload_thing_key').notNull(),

  file_link_type: text('file_link_type').notNull().$type<FileLinkType>().default(FileLinkType.NORMAL),
  file_link: text('file_link').notNull(),

  file_expiration_type: text('file_expiration_type').notNull().$type<FileExpirationType>().default(FileExpirationType.TIME),
  expiration_value: integer('expiration_value').default(24).notNull(),

  file_protection_type: text('file_protection_type').notNull().$type<FileProtectionType>().default(FileProtectionType.PUBLIC),
  authorized_emails: text('authorized_emails').array(),
  password_hash: text('password_hash'),

  user_id: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  file_share_link_id: uuid('file_share_link_id').notNull().references(() => file_share_link.id, { onDelete: 'cascade' }),

  created_at: timestamp('created_at').notNull(),
  updated_at: timestamp('updated_at').notNull(),
});


export const file_share_link = pgTable("file_share_link", {
  id: uuid('id').primaryKey().defaultRandom(),
  file_share_link: text('file_share_link').notNull().unique(),

  created_at: timestamp('created_at').notNull(),
  updated_at: timestamp('updated_at').notNull(),
});


export const file_download_tracking = pgTable("file_download_tracking", {
  id: uuid('id').primaryKey().defaultRandom(),
  download_count: integer('download_count').notNull().default(0),
  visit_count: integer('visit_count').notNull().default(0),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  email: text('email'),

  file_share_link_id: uuid('file_share_link_id').references(() => file_share_link.id, { onDelete: 'cascade' }),
  user_id: text('user_id').references(() => user.id, { onDelete: 'cascade' }),

  created_at: timestamp('created_at').notNull(),
  updated_at: timestamp('updated_at').notNull(),
}, (table) => {
  return {
    unqFileLinkIp: uniqueIndex("file_download_tracking_file_link_ip_unq").on(table.file_share_link_id, table.ip_address),
  };
});


export const otp_password = pgTable("otp_password", {
  id: uuid('id').primaryKey().defaultRandom(),
  password: text('password').notNull(),
  user_id: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),

  file_share_link_id: uuid('file_share_link_id').notNull().references(() => file_share_link.id, { onDelete: 'cascade' }),

  created_at: timestamp('created_at').notNull(),
  expires_at: timestamp('expires_at').notNull(),
  updated_at: timestamp('updated_at').notNull(),
}, (table) => {
  return {
    unq: uniqueIndex("otp_password_email_file_share_link_id_unq").on(table.email, table.file_share_link_id),
  };
});


export const file_access_token = pgTable("file_access_token", {
  id: uuid('id').primaryKey().defaultRandom(),
  token: text('token').notNull().unique(),

  file_share_link_id: uuid('file_share_link_id').notNull().references(() => file_share_link.id, { onDelete: 'cascade' }),

  created_at: timestamp('created_at').notNull(),
  expires_at: timestamp('expires_at').notNull(),
  updated_at: timestamp('updated_at').notNull(),
});
