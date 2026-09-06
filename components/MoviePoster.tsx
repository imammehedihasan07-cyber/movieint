"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Film } from "lucide-react";

interface MoviePosterProps extends Omit<ImageProps, "onError"> {
  fallbackTitle?: string;
}

export default function MoviePoster({
  src,
  alt,
  fallbackTitle,
  className,
  ...props
}: MoviePosterProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="w-full h-full bg-[#0d121f] border border-white/5 flex flex-col items-center justify-center p-3 text-center">
        <Film className="w-6 h-6 text-slate-600 mb-1" />
        <span className="text-[10px] text-slate-500 line-clamp-2">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
