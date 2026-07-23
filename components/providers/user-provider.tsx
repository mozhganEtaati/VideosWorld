"use client";

import * as React from "react";
import type { CardItem, MediaType } from "@/types/tmdb";

/** A favorited title — enough to render a card and link to it. */
export interface FavoriteItem extends CardItem {
  media_type: MediaType;
}

interface SessionUser {
  username: string;
  email: string;
  phone: string;
}

interface StoredUser extends SessionUser {
  password: string;
}

interface RegisterInput {
  username: string;
  email: string;
  phone: string;
  password: string;
}

interface Result {
  ok: boolean;
  error?: string;
}

interface UserContextValue {
  ready: boolean;
  user: SessionUser | null;
  favorites: FavoriteItem[];
  register: (input: RegisterInput) => Result;
  login: (username: string, password: string) => Result;
  logout: () => void;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: number) => boolean;
}

const USERS_KEY = "vw_users";
const SESSION_KEY = "vw_session";
const favKey = (username: string) => `vw_favorites_${username}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const UserContext = React.createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [favorites, setFavorites] = React.useState<FavoriteItem[]>([]);

  // hydrate from localStorage on mount (client only)
  React.useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const users = read<StoredUser[]>(USERS_KEY, []);
      const found = users.find((u) => u.username === session);
      if (found) {
        setUser({ username: found.username, email: found.email, phone: found.phone });
        setFavorites(read<FavoriteItem[]>(favKey(found.username), []));
      }
    }
    setReady(true);
  }, []);

  // persist favorites whenever they change for a logged-in user
  React.useEffect(() => {
    if (ready && user) {
      localStorage.setItem(favKey(user.username), JSON.stringify(favorites));
    }
  }, [favorites, user, ready]);

  const register = React.useCallback((input: RegisterInput): Result => {
    const users = read<StoredUser[]>(USERS_KEY, []);
    if (users.some((u) => u.username === input.username)) {
      return { ok: false, error: "این نام کاربری قبلاً ثبت شده است." };
    }
    users.push({ ...input });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, input.username);
    setUser({ username: input.username, email: input.email, phone: input.phone });
    setFavorites(read<FavoriteItem[]>(favKey(input.username), []));
    return { ok: true };
  }, []);

  const login = React.useCallback((username: string, password: string): Result => {
    const users = read<StoredUser[]>(USERS_KEY, []);
    const found = users.find((u) => u.username === username && u.password === password);
    if (!found) {
      return { ok: false, error: "نام کاربری یا رمز عبور اشتباه است." };
    }
    localStorage.setItem(SESSION_KEY, found.username);
    setUser({ username: found.username, email: found.email, phone: found.phone });
    setFavorites(read<FavoriteItem[]>(favKey(found.username), []));
    return { ok: true };
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setFavorites([]);
  }, []);

  const toggleFavorite = React.useCallback((item: FavoriteItem) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === item.id)
        ? prev.filter((f) => f.id !== item.id)
        : [item, ...prev],
    );
  }, []);

  const isFavorite = React.useCallback(
    (id: number) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const value: UserContextValue = {
    ready,
    user,
    favorites,
    register,
    login,
    logout,
    toggleFavorite,
    isFavorite,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = React.useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
