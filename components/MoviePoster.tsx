"use client";

import { useState } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";
import { Film } from "lucide-react";

interface MoviePosterProps extends Omit<ImageProps, "src"> {
  src?: string | StaticImageData | null;
  fallbackTitle?: string;
}

export default function MoviePoster({
  src,
  alt,
  fallbackTitle = "No Visual",
  className = "",
  fill,
  width,
  height,
  priority = false,
  sizes = "(max-width: 640px) 160px, (max-width: 1024px) 240px, 342px",
  ...props
}: MoviePosterProps) {
  const [error, setError] = useState(false);

  // TMDB URL Optimization: Intercept w500 / original and serve lightweight w342
  let optimizedSrc = src;
  if (typeof src === "string" && src.includes("image.tmdb.org")) {
    optimizedSrc = src.replace(/\/t\/p\/(w500|original)\//, "/t/p/w342/");
  }

  // If no source is provided or the image failed to load, display the branded fallback
  if (!optimizedSrc || error) {
    return (
      <div
        className={`w-full h-full min-h-[140px] bg-[#0c101a] border border-white/5 flex flex-col items-center justify-center p-3 text-center ${className}`}
      >
        <Film className="w-6 h-6 text-slate-600 mb-2" />
        <span className="text-[10px] font-mono text-slate-400 line-clamp-2 leading-tight">
          {fallbackTitle}
        </span>
        <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mt-1">
          No Visual
        </span>
      </div>
    );
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt || fallbackTitle}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={fill ? sizes : undefined}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
