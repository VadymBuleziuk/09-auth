import { nextServer } from "./api";
import type { Note, NewNote } from "@/types/note";
import { User } from "@/types/user";

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

type CheckSessionRequest = {
  success: boolean;
};

export type UpdateUserRequest = {
  userName?: string;
};

const BASE_URL = "https://notehub-api.goit.study";
export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export const fetchNotes = async (
  search: string,
  page: number,
  perPage: number,
  tag?: string,
): Promise<NoteResponse> => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  const response = await nextServer.get<NoteResponse>(BASE_URL, {
    params: {
      search,
      page,
      perPage,
      tag,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("NOTES RESPONSE", response.data);

  return response.data;
};

export const fetchNoteById = async (idNote: string): Promise<Note> => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  const response = await nextServer.get<Note>(`${BASE_URL}/${idNote}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createNote = async (noteData: NewNote): Promise<Note> => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  console.log("TOKEN:", token);
  const response = await nextServer.post<Note>(BASE_URL, noteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteNote = async (idNote: string): Promise<Note> => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  const response = await nextServer.delete<Note>(`${BASE_URL}/${idNote}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateMe = async (payload: UpdateUserRequest) => {
  const res = await nextServer.put<User>("/users/me", payload);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};
export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};
export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};
export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};
