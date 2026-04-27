"use client";

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: string;
}

export const ImageSkeleton = ({ className = "", aspectRatio = "aspect-video" }: ImageSkeletonProps) => {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 animate-pulse ${aspectRatio} ${className}`}
    >
      {/* Gradient shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
    </div>
  );
};