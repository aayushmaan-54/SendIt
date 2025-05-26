import { NextRequest, NextResponse } from 'next/server';
import { devLogger } from "@/common/utils/dev-logger";
import { UTApi } from 'uploadthing/server';
import {
  file_download_tracking,
  FileExpirationType,
  file_share_link,
  file,
} from '@/drizzle/schema';
import db from '@/common/lib/db';
import { inArray, sql, eq } from 'drizzle-orm';

const utapi = new UTApi();
const BATCH_SIZE = 500;



export async function GET(request: NextRequest) {
  devLogger.info("Starting cron job for expired file cleanup...");

  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    devLogger.warn("Unauthorized access attempt to cron job cleanup.");
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date();
  const stats = {
    timeExpired: 0,
    downloadLimitExpired: 0,
    oneTimeDownloadExpired: 0,
    databaseRowsDeleted: 0,
    uploadthingFilesDeleted: 0,
    errors: 0,
  };


  try {
    const timeExpiredFiles = await db
      .select({
        id: file.id,
        fileShareLinkId: file.file_share_link_id,
        uploadThingKey: file.uploadThingKey,
        expirationType: file.file_expiration_type,
      })
      .from(file)
      .where(
        sql`${file.file_expiration_type} = ${FileExpirationType.TIME}
            AND ${file.created_at} + INTERVAL '1 hour' * ${file.expiration_value} <= ${now}`
      );


    const downloadExpiredFiles = await db
      .select({
        id: file.id,
        fileShareLinkId: file.file_share_link_id,
        uploadThingKey: file.uploadThingKey,
        expirationType: file.file_expiration_type,
        expirationValue: file.expiration_value,
      })
      .from(file)
      .where(
        sql`${file.file_expiration_type} IN (${FileExpirationType.DOWNLOAD_LIMIT}, ${FileExpirationType.ONE_TIME_DOWNLOAD})`
      );

    const downloadBasedExpired = [];

    for (const fileRecord of downloadExpiredFiles) {
      const downloadTracking = await db
        .select({
          totalDownloads: sql<number>`COALESCE(SUM(${file_download_tracking.download_count}), 0)`.as('total_downloads'),
        })
        .from(file_download_tracking)
        .where(eq(file_download_tracking.file_share_link_id, fileRecord.fileShareLinkId));

      const totalDownloads = downloadTracking[0]?.totalDownloads || 0;

      const isExpired =
        (fileRecord.expirationType === FileExpirationType.ONE_TIME_DOWNLOAD && totalDownloads > 0) ||
        (fileRecord.expirationType === FileExpirationType.DOWNLOAD_LIMIT && totalDownloads >= fileRecord.expirationValue);

      if (isExpired) {
        downloadBasedExpired.push(fileRecord);
      }
    }


    const allExpiredFiles = [...timeExpiredFiles, ...downloadBasedExpired];

    if (allExpiredFiles.length === 0) {
      devLogger.info("No expired files found.");
      return new NextResponse(JSON.stringify({
        message: 'No expired files found',
        ...stats
      }), { status: 200 });
    }


    const expiredShareLinkIds = allExpiredFiles.map(f => f.fileShareLinkId).filter(Boolean) as string[];
    const uploadThingKeys = allExpiredFiles.map(f => f.uploadThingKey).filter(Boolean) as string[];


    allExpiredFiles.forEach(f => {
      if (f.expirationType === FileExpirationType.TIME) stats.timeExpired++;
      else if (f.expirationType === FileExpirationType.DOWNLOAD_LIMIT) stats.downloadLimitExpired++;
      else if (f.expirationType === FileExpirationType.ONE_TIME_DOWNLOAD) stats.oneTimeDownloadExpired++;
    });


    devLogger.info(`Found ${allExpiredFiles.length} expired files to cleanup`);


    if (uploadThingKeys.length > 0) {
      for (let i = 0; i < uploadThingKeys.length; i += BATCH_SIZE) {
        const batch = uploadThingKeys.slice(i, i + BATCH_SIZE);
        try {
          await utapi.deleteFiles(batch);
          stats.uploadthingFilesDeleted += batch.length;
          devLogger.info(`Deleted ${batch.length} files from UploadThing`);
        } catch (error) {
          stats.errors++;
          devLogger.error(`Error deleting UploadThing batch:`, error);
        }
      }
    }


    if (expiredShareLinkIds.length > 0) {
      for (let i = 0; i < expiredShareLinkIds.length; i += BATCH_SIZE) {
        const batch = expiredShareLinkIds.slice(i, i + BATCH_SIZE);
        try {
          const result = await db
            .delete(file_share_link)
            .where(inArray(file_share_link.id, batch));

          const deletedCount = result.rowCount || 0;
          stats.databaseRowsDeleted += deletedCount;
          devLogger.info(`Deleted ${deletedCount} share link records and related data`);
        } catch (error) {
          stats.errors++;
          devLogger.error(`Error deleting database batch:`, error);
        }
      }
    }


    devLogger.info("Cron job completed successfully with stats:", stats);


    return new NextResponse(JSON.stringify({
      message: 'Cron job completed successfully',
      totalFilesProcessed: allExpiredFiles.length,
      ...stats
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    stats.errors++;
    devLogger.error('Cron job failed with error:', error);

    return new NextResponse(JSON.stringify({
      message: 'Cron job failed',
      error: error instanceof Error ? error.message : String(error),
      ...stats
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
