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
  username?: string;
};

// Auth

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
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

export const updateMe = async (payload: UpdateUserRequest) => {
  const { data } = await nextServer.patch<User>("/users/me", payload);
  return data;
};

// Notes

export const fetchNotes = async (
  search: string,
  page: number,
  perPage: number,
  tag?: string,
): Promise<NoteResponse> => {
  const { data } = await nextServer.get<NoteResponse>("/notes", {
    params: {
      search,
      page,
      perPage,
      tag,
    },
  });

  return data;
};

export const fetchNoteById = async (idNote: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${idNote}`);

  return data;
};

export const createNote = async (noteData: NewNote): Promise<Note> => {
  const { data } = await nextServer.post<Note>("/notes", noteData);

  return data;
};

export const deleteNote = async (idNote: string): Promise<Note> => {
  const { data } = await nextServer.delete<Note>(`/notes/${idNote}`);

  return data;
};
