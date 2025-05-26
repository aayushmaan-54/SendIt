import { cookies } from "next/headers";

export const FILE_ACCESS_COOKIE_NAME = "file_access_token";


export const COOKIE_OPTIONS = {
  name: FILE_ACCESS_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  domain: process.env.NODE_ENV === 'production'
    ? process.env.COOKIE_DOMAIN
    : undefined,
  maxAge: 15 * 60, // 15 minutes
};


export const setFileAccessCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(FILE_ACCESS_COOKIE_NAME, token, COOKIE_OPTIONS);
}


export const clearFileAccessCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(FILE_ACCESS_COOKIE_NAME);
};


export const getFileAccessCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(FILE_ACCESS_COOKIE_NAME);
};
