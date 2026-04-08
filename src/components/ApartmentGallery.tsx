import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export const ApartmentGallery = ({
  type,
  images,
  onClose,
}: {
  type: string;
  images: string[];
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-dark-bg fixed inset-0 z-100 flex flex-col"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <span className="font-serif text-sm text-white/60">{type}</span>
        <button
          onClick={onClose}
          className="p-2 text-white/60 transition-colors hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <div className="relative flex grow items-center justify-center px-4 md:px-20">
        <button
          onClick={() =>
            setCurrentIndex((p) => (p - 1 + images.length) % images.length)
          }
          className="absolute left-4 z-10 p-3 text-white/40 transition-colors hover:text-white md:left-8"
        >
          <ChevronLeft size={36} />
        </button>
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${type} ${currentIndex}`}
          className="max-h-full max-w-full object-contain"
          referrerPolicy="no-referrer"
        />
        <button
          onClick={() => setCurrentIndex((p) => (p + 1) % images.length)}
          className="absolute right-4 z-10 p-3 text-white/40 transition-colors hover:text-white md:right-8"
        >
          <ChevronRight size={36} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 py-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`rounded-full transition-all duration-300 ${i === currentIndex ? "bg-gold h-1.5 w-6" : "h-1.5 w-1.5 bg-white/20"}`}
          />
        ))}
      </div>
    </motion.div>
  );
};
