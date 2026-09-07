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
  ...props
}: MoviePosterProps) {
  const [error, setError] = useState(false);

  // If no source is provided or the image failed to load, display the branded fallback
  if (!src || error) {
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
      src={src}
      alt={alt || fallbackTitle}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
