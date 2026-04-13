import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSession } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

function getS3() {
  if (!env.BUCKET0_ACCESS_KEY_ID || !env.BUCKET0_SECRET_ACCESS_KEY) {
    throw new Error("S3 credentials not configured");
  }
  return new S3Client({
    region: "auto",
    endpoint: "https://s3.bucket0.com",
    credentials: {
      accessKeyId: env.BUCKET0_ACCESS_KEY_ID,
      secretAccessKey: env.BUCKET0_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, contentType, purpose } = await req.json() as {
    filename: string;
    contentType: string;
    purpose: "profile" | "sample";
  };

  if (!filename || !contentType || !purpose) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!env.BUCKET0_BUCKET_NAME) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const s3 = getS3();
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `${session.user.id}/${purpose}/${Date.now()}.${ext}`;

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: env.BUCKET0_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 }
  );

  const publicUrl = `https://s3.bucket0.com/${env.BUCKET0_BUCKET_NAME}/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl });
}
