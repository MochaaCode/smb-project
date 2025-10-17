import { createClient } from "@/lib/supabase/server";
import { Content } from "@/types";
import ContentClient from "@/components/admin/ContentsClient";

async function getContent() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("content")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch content error:", error.message);
      return [];
    }
    return data;
  } catch (e) {
    if (e instanceof Error) {
      console.error("Unexpected error fetching content:", e.message);
    }
    return [];
  }
}

export default async function ContentPage() {
  const content: Content[] = (await getContent()) || [];
  return (
    <div>
      <ContentClient serverContent={content} />
    </div>
  );
}
