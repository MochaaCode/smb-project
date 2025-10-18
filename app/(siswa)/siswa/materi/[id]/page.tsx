import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { Paperclip } from "lucide-react";
import Image from "next/image";
import { Attachment, Material } from "@/types";

async function getMaterialDetail(id: string): Promise<Material> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("id", id)
    .eq("status", "visible")
    .single();

  if (error || !data) {
    return notFound();
  }

  if (data.attachments && Array.isArray(data.attachments)) {
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const expiresIn = 3600; 

    const validAttachments = data.attachments.filter(
      (file: any): file is Attachment => file && typeof file.path === "string"
    );

    if (validAttachments.length > 0) {
      const signedUrlsPromises = validAttachments.map((file: Attachment) =>
        supabaseAdmin.storage
          .from("material-attachments")
          .createSignedUrl(file.path, expiresIn)
      );
      const signedUrlsResults = await Promise.all(signedUrlsPromises);

      data.attachments = validAttachments.map(
        (file: Attachment, index: number) => {
          return {
            ...file,
            url: signedUrlsResults[index].data?.signedUrl || "",
          };
        }
      );
    } else {
      data.attachments = [];
    }
  }

  return data;
}

export default async function MateriDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const material = await getMaterialDetail(params.id);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Materi */}
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          {material.title}
        </h1>
        <p className="mt-2 text-gray-500">
          Materi untuk tanggal:{" "}
          {new Date(material.scheduled_for).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Isi Konten Materi & Lampiran */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <article className="prose dark:prose-invert lg:prose-xl max-w-none">
          {material.content ? (
            <div
              dangerouslySetInnerHTML={{
                __html: material.content.replace(/\n/g, "<br />"),
              }}
            />
          ) : (
            <p>&quot;Konten untuk materi ini belum tersedia.&quot;</p>
          )}

          {material.attachments && material.attachments.length > 0 && (
            <div className="mt-10 pt-6 border-t dark:border-gray-600">
              <h3 className="not-prose text-xl font-semibold mb-4 flex items-center">
                <Paperclip className="mr-2 h-5 w-5" />
                Lampiran
              </h3>
              <div className="space-y-4">
                {material.attachments.map((file: Attachment, index: number) => {

                  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file.name);

                  const downloadUrl = `/api/downloads/${file.path}`;

                  if (isImage) {
                    return (
                      <div key={index} className="relative w-full h-96">
                        <Image
                          src={downloadUrl}
                          alt={file.name}
                          fill
                          style={{ objectFit: "contain" }}
                          className="rounded-lg shadow-md"
                        />
                      </div>
                    );
                  } else {
                    return (
                      <a
                        key={index}
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="not-prose flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors no-underline"
                      >
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                          {file.name}
                        </span>
                      </a>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
