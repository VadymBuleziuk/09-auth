import { nextServer } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";
import { cookies } from "next/headers";

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};
export const fetchNotes = async (
  search: string,
  page: number,
  perPage: number,
  tag?: string,
): Promise<NoteResponse> => {
  const cookieStore = await cookies();
  const response = await nextServer.get<NoteResponse>("/notes", {
    params: {
      search,
      page,
      perPage,
      tag,
    },
    headers: { Cookie: cookieStore.toString() },
  });

  return response.data;
};

export const fetchNoteById = async (idNote: string): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(`"/notes"/${idNote}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};
