"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  children: React.ReactNode[];
  mode?: "group" | "center-focus";
  itemsToShowDesktop?: number; // Untuk mode 'group' di desktop
  itemsToShowMobile?: number; // Untuk mode 'group' di mobile
};

const AdvancedCarousel = ({
  children,
  mode = "group",
  itemsToShowDesktop = 3,
  itemsToShowMobile = 2,
}: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Tentukan jumlah item yang ditampilkan berdasarkan ukuran layar
  const itemsToShow = isMobile ? itemsToShowMobile : itemsToShowDesktop;
  const totalItems = React.Children.count(children);
  const totalPages = Math.ceil(totalItems / itemsToShow);
  const [currentPage, setCurrentPage] = useState(0);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleScroll = useCallback(
    (direction: "prev" | "next") => {
      const container = scrollRef.current;
      if (!container) return;

      let newPage;
      if (direction === "next") {
        newPage = (currentPage + 1) % totalPages;
      } else {
        newPage = (currentPage - 1 + totalPages) % totalPages;
      }

      const scrollAmount = container.clientWidth * newPage;
      container.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
      setCurrentPage(newPage);
    },
    [currentPage, totalPages]
  );

  if (mode === "center-focus") {
    return <ImageScroller>{children}</ImageScroller>;
  }

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {React.Children.map(children, (child) => (
          <div
            className="flex-shrink-0 snap-start p-2"
            style={{ width: `${100 / itemsToShow}%` }}
          >
            {child}
          </div>
        ))}
      </div>
      {/* Tombol Navigasi */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:left-2">
        <button
          onClick={() => handleScroll("prev")}
          className="rounded-full bg-white/60 p-2 text-gray-900 shadow-lg backdrop-blur-sm transition hover:bg-white"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:right-2">
        <button
          onClick={() => handleScroll("next")}
          className="rounded-full bg-white/60 p-2 text-gray-900 shadow-lg backdrop-blur-sm transition hover:bg-white"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

// Komponen terpisah khusus untuk Image Scroller
const ImageScroller = ({ children }: { children: React.ReactNode[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = children.length;

  const handleNav = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
    }
  };

  return (
    <div className="relative w-full h-64 md:h-80 flex items-center justify-center overflow-hidden">
      {children.map((child, index) => {
        const offset = index - currentIndex;
        const isVisible = Math.abs(offset) <= 1; // Hanya render 3 gambar terdekat

        if (!isVisible) return null;

        const getTransform = () => {
          if (offset === 0) return "translateX(0) scale(1)";
          if (offset === 1) return "translateX(75%) scale(0.8)";
          if (offset === -1) return "translateX(-75%) scale(0.8)";
          // Posisi "antrian" untuk loop yang mulus
          if (offset === totalItems - 1) return "translateX(-75%) scale(0.8)";
          if (offset === -(totalItems - 1)) return "translateX(75%) scale(0.8)";
          return "translateX(0) scale(0.5)";
        };

        const getOpacity = () => {
          if (offset === 0) return 1;
          if (Math.abs(offset) === 1) return 0.5;
          return 0;
        };

        const getZIndex = () => {
          if (offset === 0) return 10;
          if (Math.abs(offset) === 1) return 5;
          return 1;
        };

        return (
          <div
            key={index}
            className="absolute w-full sm:w-3/4 md:w-1/2 h-full transition-all duration-300 ease-in-out"
            style={{
              transform: getTransform(),
              opacity: getOpacity(),
              zIndex: getZIndex(),
            }}
          >
            {child}
          </div>
        );
      })}

      {/* Tombol Navigasi */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 z-20">
        <button
          onClick={() => handleNav("prev")}
          className="rounded-full bg-white/60 p-2 text-gray-900 shadow-lg backdrop-blur-sm transition hover:bg-white"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 z-20">
        <button
          onClick={() => handleNav("next")}
          className="rounded-full bg-white/60 p-2 text-gray-900 shadow-lg backdrop-blur-sm transition hover:bg-white"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default AdvancedCarousel;
