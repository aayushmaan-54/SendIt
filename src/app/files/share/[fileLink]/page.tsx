"use server";
import db from "@/common/lib/db";
import ShareFileComponent from "./components/share-file-component";
import { eq } from "drizzle-orm";
import { file } from "@/drizzle/schema";
import { notFound } from "next/navigation";


async function getFileLink(fileLink: string) {
  const data = await db.query.file.findFirst({
    where: eq(file.file_link, fileLink),
  });
  return data?.file_link;
}


export default async function ShareFilePage({ params }: Readonly<{
  params: Promise<{ fileLink: string }>
}>) {
  const { fileLink } = await params;
  const fileLinkData = await getFileLink(fileLink);
  if (!fileLinkData) return notFound();

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/f/${fileLinkData}`;
  return (
    <ShareFileComponent shareUrl={shareUrl} />
  );
}
