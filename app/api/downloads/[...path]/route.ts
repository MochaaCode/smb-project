import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const revalidate = 0; 

export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const filePath = params.path.join("/");

  if (!filePath) {
    return new NextResponse("File path is required", { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin.storage
    .from("material-attachments")
    .createSignedUrl(filePath, 3600);

  if (error || !data) {
    console.error("Error creating signed URL:", error);
    return new NextResponse("File not found or access denied", { status: 404 });
  }

  const signedUrl = data.signedUrl;

  try {
    const fileResponse = await fetch(signedUrl);

    if (!fileResponse.ok) {
      return new NextResponse("Failed to fetch file from storage", {
        status: fileResponse.status,
      });
    }

    const contentType = fileResponse.headers.get("content-type");

    const headers = new Headers();
    if (contentType) {
      headers.set("Content-Type", contentType);
    }
    headers.set(
      "Content-Disposition",
      `inline; filename="${params.path[params.path.length - 1]}"`
    );

    return new NextResponse(fileResponse.body, {
      status: 200,
      headers,
    });
  } catch (e) {
    console.error("Error streaming file:", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
