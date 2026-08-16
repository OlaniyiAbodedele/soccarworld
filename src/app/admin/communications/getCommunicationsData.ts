import "server-only";

import { createClient as createAdminClient } from "@supabase/supabase-js";

export type AdminCommunication = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  status: string;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getCommunicationsData(): Promise<
  AdminCommunication[]
> {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing required Supabase server environment variables."
    );
  }

  const supabaseAdmin =
    createAdminClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("founder_updates")
    .select(
      `
        id,
        title,
        slug,
        excerpt,
        body,
        category,
        status,
        is_featured,
        published_at,
        created_at,
        updated_at
      `
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "SoccaR Admin Communications query error:",
      error
    );

    throw new Error(
      "Could not retrieve Founder communications."
    );
  }

  return (data ?? []).map(
    (update) => ({
      id: update.id,
      title: update.title,
      slug: update.slug,
      excerpt: update.excerpt,
      body: update.body,
      category: update.category,
      status: update.status,
      isFeatured: update.is_featured,
      publishedAt: update.published_at,
      createdAt: update.created_at,
      updatedAt: update.updated_at,
    })
  );
}