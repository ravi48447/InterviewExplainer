/**
 * InterviewExplainer Design Tokens
 * Reusable constants representing the design system values.
 */

export const TYPOGRAPHY = {
  fontSize: {
    xs: "text-xs", // 12px - Caption / Badge
    sm: "text-sm", // 14px - Body / Input
    base: "text-base", // 16px - Large body / Lead
    lg: "text-lg", // 18px - Subheading
    xl: "text-xl", // 20px - Section title
    h3: "text-2xl", // 24px - Minor heading
    h2: "text-3xl", // 30px - Main section heading
    h1: "text-4xl", // 36px - Page title
    display: "text-5xl lg:text-6xl", // Hero display
  },
  fontWeight: {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    black: "font-black",
  },
} as const;

export const SPACING = {
  xs: "space-y-2 gap-2",
  sm: "space-y-4 gap-4",
  md: "space-y-6 gap-6",
  lg: "space-y-8 gap-8",
  xl: "space-y-12 gap-12",
} as const;

export const RADIUS = {
  none: "rounded-none",
  sm: "rounded-sm", // 2px
  md: "rounded-md", // 4px
  lg: "rounded-lg", // 8px (default button / input)
  xl: "rounded-xl", // 12px (cards)
  xxl: "rounded-2xl", // 16px (large dialogs / sections)
  full: "rounded-full",
} as const;

export const SHADOWS = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  xxl: "shadow-2xl",
  none: "shadow-none",
} as const;

export const ANIMATIONS = {
  duration: {
    fast: "duration-150",
    normal: "duration-300",
    slow: "duration-500",
  },
  easing: {
    easeInOut: "ease-in-out",
    easeOut: "ease-out",
    easeIn: "ease-in",
    linear: "linear",
  },
} as const;

export const Z_INDEX = {
  dropdown: "z-10",
  sticky: "z-20",
  fixed: "z-30",
  modal: "z-40",
  popover: "z-50",
} as const;

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  xxl: "1536px",
} as const;
