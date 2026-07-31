import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import Notes from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { Metadata } from "next";

interface NoteDetailsProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{
    page?: string;
    query?: string;
    perPage?: number;
  }>;
}
export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "all" ? "All tags" : slug[0];
  return {
    title: `Notes - ${tag}`,
    description: `Browse notes tagged with ${tag}. NoteHub allows you to filter and view notes based on specific tags for better organization.`,
    openGraph: {
      title: `Notes - ${tag}`,
      description: `Browse notes tagged with ${tag}. NoteHub allows you to filter and view notes based on specific tags for better organization.`,
      url: `https://notehub.com/notes/filter/${slug.join("/")}`,

      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `${tag}`,
        },
      ],
    },
  };
}

const NotesDetails = async ({ searchParams, params }: NoteDetailsProps) => {
  const paramsSearch = await searchParams;

  const page = Number(paramsSearch.page) || 1;
  const query = paramsSearch.query ?? "";
  const perPage = 12;
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", query, page, tag],
    queryFn: () => fetchNotes(query, page, perPage, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes initialPage={page} initialQuery={query} tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesDetails;
