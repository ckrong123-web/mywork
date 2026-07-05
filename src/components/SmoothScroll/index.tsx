"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import type { Scroll } from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  return (
    <LocomotiveScrollProvider
      options={{ smooth: true }}
      watch={[pathname]}
      containerRef={containerRef}
      location={pathname}
      onLocationChange={(scroll: Scroll) =>
        scroll.scrollTo(0, { duration: 0, disableLerp: true })
      }
    >
      <div data-scroll-container ref={containerRef}>
        {children}
      </div>
    </LocomotiveScrollProvider>
  );
}
