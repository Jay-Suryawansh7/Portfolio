"use client";

import React, { useState, useEffect, useRef } from "react";
import Image, { ImageProps } from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProgressiveImageProps extends Omit<ImageProps, "onLoad"> {
  lowResSrc?: string;
  className?: string;
  containerClassName?: string;
}

export default function ProgressiveImage({
  src,
  alt,
  lowResSrc,
  className = "",
  containerClassName = "",
  ...props
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLowResLoaded, setIsLowResLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Placeholder skeleton */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse"
          />
        )}
      </AnimatePresence>

      {/* Low-res blur placeholder */}
      {lowResSrc && !isLoaded && (
        <Image
          src={lowResSrc}
          alt=""
          fill
          className={`object-cover blur-lg scale-110 transition-opacity ${
            isLowResLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLowResLoaded(true)}
          priority={false}
        />
      )}

      {/* Main image */}
      <Image
        src={src}
        alt={alt}
        className={`transition-all duration-700 ${
          isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}

// Lazy-loaded image with intersection observer
export function LazyImage({
  src,
  alt,
  className = "",
  ...props
}: ImageProps & { className?: string }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      {shouldLoad ? (
        <Image src={src} alt={alt} className={className} {...props} />
      ) : (
        <div className="bg-gray-800 animate-pulse" style={{ aspectRatio: "16/9" }} />
      )}
    </div>
  );
}
