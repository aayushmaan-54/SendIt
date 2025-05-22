import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid
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


export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  email_verified: boolean('email_verified').notNull(),
  image: text('image'),

  created_at: timestamp('created_at').notNull(),
  updated_at: timestamp('updated_at').notNull(),
});


export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expires_at: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),

  user_id: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),

  created_at: timestamp('created_at').notNull(),
  updated_at: timestamp('updated_at').notNull(),
});

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  account_id: text('account_id').notNull(),
  provider_id: text('provider_id').notNull(),
  user_id: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  access_token: text('access_token'),
  refresh_token: text('refresh_token'),
  id_token: text('id_token'),
  access_token_expires_at: timestamp('access_token_expires_at'),
  refresh_token_expires_at: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),

  created_at: timestamp('created_at').notNull(),
  updated_at: timestamp('updated_at').notNull(),
});


export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),

  expires_at: timestamp('expires_at').notNull(),

  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
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

  user_id: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),

  created_at: timestamp('created_at').notNull(),
  updated_at: timestamp('updated_at').notNull(),
});
