"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Custom next/image loader for TMDB.
 *
 * TMDB already serves pre-sized images (w185/w342/w500/w1280/…) from a fast
 * global CDN, and every URL we build carries the right size for its context.
 * Setting a custom loader makes Next serve those URLs directly and skip its
 * own Image Optimization API — one fewer network hop and no server-side
 * resize, which is the main source of the slow first paint (especially in
 * `next dev`, where the optimizer re-runs on every request).
 *
 * The size is already baked into `src`, so we pass it through unchanged. Any
 * non-TMDB / local asset also passes through untouched.
 */
export default function tmdbImageLoader({ src }: ImageLoaderProps): string {
  return src;
}
