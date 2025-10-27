// hooks/useScrollAnimation.ts
"use client";

import { useEffect, useRef, useState, RefObject } from "react";

// Menambahkan tipe IntersectionObserverInit untuk options
type UseScrollAnimationOptions = IntersectionObserverInit;

// Menentukan tipe data yang dikembalikan oleh hook menggunakan tuple
type UseScrollAnimationReturn = [RefObject<HTMLDivElement>, boolean];

export const useScrollAnimation = (
  options?: UseScrollAnimationOptions
): UseScrollAnimationReturn => {
  // Secara eksplisit memberitahu TypeScript bahwa ini adalah ref untuk HTMLDivElement
  // yang nilai awalnya adalah null. Ini adalah cara yang benar.
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Membuat variabel untuk ref.current di dalam effect.
    // Ini adalah praktik terbaik untuk menghindari masalah 'stale closure' di fungsi cleanup.
    const currentRef = ref.current;

    const observer = new IntersectionObserver(([entry]) => {
      // Hanya picu sekali saja
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Kita bisa langsung berhenti mengamati setelah elemen terlihat
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      }
    }, options);

    // Amati elemen jika ia ada
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Fungsi cleanup
    return () => {
      // Berhenti mengamati elemen saat komponen di-unmount
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]); // Ref object itu sendiri stabil, jadi tidak perlu dimasukkan ke dependency array.

  return [ref, isVisible];
};
