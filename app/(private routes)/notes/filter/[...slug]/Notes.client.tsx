"use client";

import { useState } from "react";
import css from "./Notes.client.module.css";
import NoteList from "@/components/NoteList/NoteList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes, type NoteResponse } from "@/lib/api/clientApi";
import Pagination from "@/components/Pagination/Pagination";

import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";

interface NotesProps {
  initialQuery: string;
  initialPage: number;
  tag?: string;
}

function Notes({ initialPage, initialQuery, tag }: NotesProps) {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const perPage = 12;
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 500);

  const { data, isSuccess } = useQuery<NoteResponse>({
    queryKey: ["notes", query, page, tag],
    queryFn: () => fetchNotes(query, page, perPage, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={query} onChange={debouncedSearch} />

          {isSuccess && data.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}
              forcePage={page}
              onPageChange={setPage}
            />
          )}
          <Link className={css.button} href="/notes/action/create">
            Create note +
          </Link>
        </header>
        {isSuccess && <NoteList notes={data.notes} />}
      </div>
    </>
  );
}

export default Notes;
