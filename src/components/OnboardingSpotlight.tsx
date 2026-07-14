import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface OnboardingSpotlightProps {
  targetSelector: string;
  onboardingKey: string;
  title: string;
  description: string;
  buttonText?: string;
  padding?: number;
  borderRadius?: number; // Target element border radius (e.g. 24 for rounded-3xl)
  onDismiss?: () => void;
}

export default function OnboardingSpotlight({
  targetSelector,
  onboardingKey,
  title,
  description,
  buttonText = "حسنًا",
  padding = 8,
  borderRadius = 24,
  onDismiss,
}: OnboardingSpotlightProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastRectRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // Check if onboarding is already dismissed
  useEffect(() => {
    const isDismissed = localStorage.getItem(onboardingKey);
    if (!isDismissed) {
      // Small delay to ensure the page is fully rendered and the target is visible
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Scroll the target element into view smoothly so onboarding is centered
        const element = document.querySelector(targetSelector);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        updateRect();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [onboardingKey, targetSelector]);

  // Function to update coordinates of target element safely (only setting state on actual changes)
  const updateRect = () => {
    const element = document.querySelector(targetSelector);
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

  // Add event listeners for resizing, scrolling, and keyboard keys
  useEffect(() => {
    if (!isOpen) return;

    updateRect();

    // Setup an interval to poll position changes during rendering/animations (every 50ms)
    const positionInterval = setInterval(() => {
      updateRect();
    }, 50);

    // ResizeObserver to track target element size changes dynamically
    let resizeObserver: ResizeObserver | null = null;
    const element = document.querySelector(targetSelector);
    if (element) {
      resizeObserver = new ResizeObserver(() => {
        updateRect();
      });
      resizeObserver.observe(element);
    }

    // Window event listeners
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });

    // Focus the dismiss button for accessibility
    if (buttonRef.current) {
      buttonRef.current.focus();
    }

    // Keyboard listener for Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Prevent body scrolling while onboarding is active
    document.body.style.overflow = "hidden";

    return () => {
      clearInterval(positionInterval);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, targetSelector]);

  const handleDismiss = () => {
    localStorage.setItem(onboardingKey, "true");
    setIsOpen(false);
    document.body.style.overflow = "";
    if (onDismiss) {
      onDismiss();
    }
    window.dispatchEvent(new Event("wajih_onboarding_step1_done"));
  };

  if (!isOpen || !rect) return null;

  const { x, y, width, height } = rect;
  
  // Concentric border radius calculation: inner radius + padding
  const padX = x - padding;
  const padY = y - padding;
  const padW = width + padding * 2;
  const padH = height + padding * 2;
  const outerRadius = borderRadius + padding;

  // Calculate tooltip position
  const isMobile = windowSize.width < 640;
  
  // Default placement calculation
  let tooltipStyle: React.CSSProperties = {};
  let placement: "top" | "bottom" | "center" = "bottom";

  if (isMobile) {
    // Floating at the bottom on mobile screens for better responsiveness
    tooltipStyle = {
      position: "fixed",
      bottom: "24px",
      left: "16px",
      right: "16px",
      zIndex: 9999,
    };
    placement = "center";
  } else {
    const tooltipWidth = 360;
    const tooltipHeight = 180;
    const spaceBelow = windowSize.height - (y + height + padding);
    const spaceAbove = y - padding;

    const leftPos = Math.max(
      16,
      Math.min(
        windowSize.width - tooltipWidth - 16,
        x + width / 2 - tooltipWidth / 2
      )
    );

    if (spaceBelow >= tooltipHeight + 20) {
      placement = "bottom";
      tooltipStyle = {
        position: "fixed",
        top: `${y + height + padding + 16}px`,
        left: `${leftPos}px`,
        width: `${tooltipWidth}px`,
        zIndex: 9999,
      };
    } else if (spaceAbove >= tooltipHeight + 20) {
      placement = "top";
      tooltipStyle = {
        position: "fixed",
        top: `${y - padding - tooltipHeight - 16}px`,
        left: `${leftPos}px`,
        width: `${tooltipWidth}px`,
        zIndex: 9999,
      };
    } else {
      placement = "center";
      tooltipStyle = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: `${tooltipWidth}px`,
        zIndex: 9999,
      };
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9990] select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-desc"
    >
      {/* SVG Mask with Perfect Rounded Cutout */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
        style={{ zIndex: 9990 }}
      >
        <defs>
          <mask id="onboarding-spotlight-mask">
            {/* Everything white remains dark overlay */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Everything black becomes a perfectly rounded transparent cutout */}
            <rect
              x={padX}
              y={padY}
              width={padW}
              height={padH}
              rx={outerRadius}
              ry={outerRadius}
              fill="black"
            />
          </mask>
        </defs>
        {/* Draw the semi-transparent dark screen with our custom mask */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(2, 9, 7, 0.78)"
          mask="url(#onboarding-spotlight-mask)"
          className="pointer-events-auto"
        />
      </svg>

      {/* Perfect glowing border ring concentric with the rounded cutout */}
      <div
        className="fixed pointer-events-none transition-all duration-300 animate-pulse"
        style={{
          left: `${padX}px`,
          top: `${padY}px`,
          width: `${padW}px`,
          height: `${padH}px`,
          boxShadow: "0 0 0 3px #C4A15A, 0 0 24px 8px rgba(196, 161, 90, 0.6)",
          zIndex: 9991,
          borderRadius: `${outerRadius}px`,
        }}
      />

      {/* Tooltip Popover */}
      <div
        style={tooltipStyle}
        className="bg-white border border-slate-150 rounded-2xl shadow-2xl p-6 text-right space-y-4 animate-scale-up select-text"
        dir="rtl"
      >
        {/* Decorative arrow pointing to cutout (only on desktop top/bottom placements) */}
        {!isMobile && placement !== "center" && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-slate-150 rotate-45 ${
              placement === "bottom" ? "-top-2 border-r-0 border-b-0" : "-bottom-2 border-l-0 border-t-0 border-r border-b"
            }`}
          />
        )}

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#004B3E]/10 text-[#004B3E] rounded-xl">
            <svg
              className="w-5 h-5 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M13 10V3L4 14h7v7l9-11h-7z"
            />
            </svg>
          </div>
          <h4
            id="onboarding-title"
            className="font-black text-sm text-[#004B3E]"
          >
            {title}
          </h4>
        </div>

        {/* Description */}
        <p
          id="onboarding-desc"
          className="text-xs font-semibold text-slate-600 leading-relaxed"
        >
          {description}
        </p>

        {/* Action Button */}
        <div className="flex justify-start pt-1">
          <button
            ref={buttonRef}
            onClick={handleDismiss}
            className="bg-[#004B3E] hover:bg-[#003B31] text-white px-5 py-2 rounded-xl font-extrabold text-xs transition duration-200 shadow-md cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C4A15A] focus:ring-offset-2"
          >
            <span>{buttonText}</span>
            <svg
              className="w-4 h-4"
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
