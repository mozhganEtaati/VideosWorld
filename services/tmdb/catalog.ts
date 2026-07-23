import "server-only";
import { discover, getList } from "./endpoints";
import type { CategoryDef } from "@/constants/config";
import type { TmdbListItem, TmdbPaginated } from "@/types/tmdb";

/** Resolve a category definition to a page of results (list or discover). */
export function getCategoryItems(
  cat: CategoryDef,
  page = 1,
): Promise<TmdbPaginated<TmdbListItem>> {
  if (cat.list) return getList(cat.mediaType, cat.list, page);
  return discover(cat.mediaType, { ...cat.params, page });
}
