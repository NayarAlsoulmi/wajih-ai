import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { HelpCircle, ChevronRight, Compass, Sparkles } from "lucide-react";

interface SidebarOnboardingProps {
  onboardingKey: string; // e.g. wajih-individual-sidebar-onboarding
  triggerKey: string;    // e.g. wajih-individual-onboarding-banner
  title: string;
  description: string;
  buttonText?: string;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}

export default function SidebarOnboarding({
  onboardingKey,
  triggerKey,
  title,
  description,
  buttonText = "فهمت",
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarOnboardingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastRectRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // Check storage to determine if this step is active
  const checkStatus = () => {
    const parentDismissed = localStorage.getItem(triggerKey) === "true";
    const selfDismissed = localStorage.getItem(onboardingKey) === "true";

    if (parentDismissed && !selfDismissed) {
      setIsOpen(true);
      // Auto-open sidebar on mobile so they see the highlighted menu
      if (setIsSidebarOpen && window.innerWidth < 1024 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkStatus();

    // Setup listener for storage/dismissal events
    const handleStep1Done = () => {
      checkStatus();
    };
    window.addEventListener("wajih_onboarding_step1_done", handleStep1Done);
    
    // Polling interval as robust fallback
    const interval = setInterval(checkStatus, 300);

    return () => {
      window.removeEventListener("wajih_onboarding_step1_done", handleStep1Done);
      clearInterval(interval);
    };
  }, [triggerKey, onboardingKey, isSidebarOpen, setIsSidebarOpen]);

  // Track target `#sidebar-navigation` element size and position
  const updateRect = () => {
    if (!isOpen) return;

    const element = document.querySelector("#sidebar-navigation");
    if (element) {
      const clientRect = element.getBoundingClientRect();
      const newRect = {
        x: clientRect.x,
        y: clientRect.y,
        width: clientRect.width,
        height: clientRect.height,
      };

      if (
        !lastRectRef.current ||
        lastRectRef.current.x !== newRect.x ||
        lastRectRef.current.y !== newRect.y ||
        lastRectRef.current.width !== newRect.width ||
        lastRectRef.current.height !== newRect.height
      ) {
        lastRectRef.current = newRect;
        setRect(clientRect);
      }
    }

    const newSize = { width: window.innerWidth, height: window.innerHeight };
    setWindowSize((prev) => {
      if (prev.width !== newSize.width || prev.height !== newSize.height) {
        return newSize;
      }
      return prev;
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    updateRect();

    // 50ms interval for highly responsive real-time layout updates
    const positionInterval = setInterval(updateRect, 50);

    // ResizeObserver for container changes
    let resizeObserver: ResizeObserver | null = null;
    const element = document.querySelector("#sidebar-navigation");
    if (element) {
      resizeObserver = new ResizeObserver(() => {
        updateRect();
      });
      resizeObserver.observe(element);
    }

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });

    if (buttonRef.current) {
      buttonRef.current.focus();
    }

    return () => {
      clearInterval(positionInterval);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, [isOpen]);

  const handleDismiss = () => {
    localStorage.setItem(onboardingKey, "true");
    setIsOpen(false);
  };

  if (!isOpen || !rect) return null;

  const isMobile = windowSize.width < 1024;
  
  // Calculate tooltip placement - on the left side of the sidebar
  let tooltipStyle: React.CSSProperties = {};
  
  if (isMobile) {
    // Overlaid floating card at the bottom of the viewport on mobile screens
    tooltipStyle = {
      position: "fixed",
      bottom: "24px",
      left: "16px",
      right: "16px",
      zIndex: 9999,
    };
  } else {
    // Aligned to the left of the sidebar
    const tooltipWidth = 330;
    // Position it at the same vertical alignment as the navigation box
    const topPos = Math.max(80, rect.top + 20);
    // Sit 20px to the left of the sidebar's left edge
    const leftPos = rect.left - tooltipWidth - 20;

    tooltipStyle = {
      position: "fixed",
      top: `${topPos}px`,
      left: `${leftPos}px`,
      width: `${tooltipWidth}px`,
      zIndex: 9999,
    };
  }

  return createPortal(
    <div className="fixed inset-0 z-[9930] pointer-events-none select-none">
      {/* 1. Subtle, Elegant Pulse Golden Halo around the navigation links container */}
      <div
        className="fixed pointer-events-none transition-all duration-300"
        style={{
          left: `${rect.left - 6}px`,
          top: `${rect.top - 6}px`,
          width: `${rect.width + 12}px`,
          height: `${rect.height + 12}px`,
          boxShadow: "0 0 0 2px #C4A15A, 0 0 16px 4px rgba(196, 161, 90, 0.45)",
          zIndex: 9935,
          borderRadius: "16px",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      />

      {/* 2. Tooltip Card */}
      <div
        style={tooltipStyle}
        className="pointer-events-auto bg-white border border-slate-150 rounded-2xl shadow-2xl p-5 text-right space-y-3.5 animate-scale-up select-text"
        dir="rtl"
      >
        {/* Decorative arrow pointing to the right (toward the sidebar) - only on desktop */}
        {!isMobile && (
          <div
            className="absolute -right-2 top-8 w-4 h-4 bg-white border-r border-t border-slate-150 rotate-45"
            style={{ transform: "rotate(45deg) translateY(-50%)" }}
          />
        )}

        {/* Title & Icon */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#004B3E]/10 text-[#004B3E] rounded-lg">
            <Compass className="w-4 h-4 text-[#C4A15A] animate-spin-slow" />
          </div>
          <h4 className="font-black text-xs text-[#004B3E]">
            {title}
          </h4>
        </div>

        {/* Description */}
        <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
          {description}
        </p>

        {/* CTA Button */}
        <div className="flex justify-start pt-1">
          <button
            ref={buttonRef}
            onClick={handleDismiss}
            className="bg-[#004B3E] hover:bg-[#003B31] text-white px-4 py-1.5 rounded-lg font-extrabold text-[10px] transition duration-200 shadow-md cursor-pointer flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#C4A15A] focus:ring-offset-1"
          >
            <span>{buttonText}</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
