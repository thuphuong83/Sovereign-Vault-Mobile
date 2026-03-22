/**
 * The Sovereign Editorial — Design Token Constants
 * Single source of truth for use in StyleSheet and inline styles.
 * Mirror of tailwind.config.js for runtime use.
 */

// ── Color Palette ──────────────────────────────────────────────────────────
export const Colors = {
  primary: '#000b21',
  primary_container: '#0d2240',
  on_primary: '#ffffff',
  on_primary_fixed: '#051b39',

  secondary: '#4e6180',
  secondary_container: '#d6e3f7',
  on_secondary: '#ffffff',
  on_secondary_container: '#0a1e33',

  tertiary: '#c9993a',
  tertiary_fixed: '#ffdea6',
  on_tertiary: '#ffffff',
  on_tertiary_container: '#2b1800',
  tertiary_container: '#3d2a00',

  surface: '#f6fafe',
  surface_variant: '#dce4f0',
  surface_container_lowest: '#ffffff',
  surface_container_low: '#f0f4f8',
  surface_container: '#e8eef6',
  surface_container_high: '#dde4ef',
  surface_container_highest: '#d2daea',

  outline: '#6e7f96',
  outline_variant: '#bec8d8',

  on_surface: '#0f1c2a',
  on_surface_variant: '#3f4f62',

  error: '#ba1a1a',
  error_container: '#ffdad6',

  // Dark mode equivalents
  dark: {
    primary: '#aac7ff',
    primary_container: '#0d2240',
    surface: '#0f1c2a',
    surface_container_low: '#1a2a3d',
    surface_container: '#1f3148',
    surface_container_high: '#253852',
    on_surface: '#dde3ea',
  },
} as const;

// ── Typography Scale ───────────────────────────────────────────────────────
export const Typography = {
  // Manrope — Display & Headlines
  display_lg: { fontSize: 56, lineHeight: 64, letterSpacing: -1, fontFamily: 'Manrope_800ExtraBold' },
  display_md: { fontSize: 45, lineHeight: 52, letterSpacing: -0.5, fontFamily: 'Manrope_700Bold' },
  display_sm: { fontSize: 36, lineHeight: 44, fontFamily: 'Manrope_700Bold' },
  headline_lg: { fontSize: 32, lineHeight: 40, fontFamily: 'Manrope_700Bold' },
  headline_md: { fontSize: 28, lineHeight: 36, fontFamily: 'Manrope_600SemiBold' },
  headline_sm: { fontSize: 24, lineHeight: 32, fontFamily: 'Manrope_600SemiBold' },
  // Inter — Body & Labels
  title_lg: { fontSize: 22, lineHeight: 28, fontFamily: 'Inter_600SemiBold' },
  title_md: { fontSize: 18, lineHeight: 24, letterSpacing: 0.15, fontFamily: 'Inter_500Medium' },
  title_sm: { fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontFamily: 'Inter_500Medium' },
  body_lg: { fontSize: 16, lineHeight: 24, letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
  body_md: { fontSize: 14, lineHeight: 20, letterSpacing: 0.25, fontFamily: 'Inter_400Regular' },
  body_sm: { fontSize: 12, lineHeight: 16, letterSpacing: 0.4, fontFamily: 'Inter_400Regular' },
  label_lg: { fontSize: 14, lineHeight: 20, letterSpacing: 0.1, fontFamily: 'Inter_500Medium' },
  label_md: { fontSize: 12, lineHeight: 16, letterSpacing: 0.5, fontFamily: 'Inter_500Medium' },
  label_sm: { fontSize: 11, lineHeight: 16, letterSpacing: 0.5, fontFamily: 'Inter_400Regular' },
} as const;

// ── Spacing ────────────────────────────────────────────────────────────────
export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

// ── Border Radius ──────────────────────────────────────────────────────────
export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

// ── Shadows ────────────────────────────────────────────────────────────────
export const Shadows = {
  // Ambient — ultra-diffused, navy-tinted
  ambient: {
    shadowColor: '#051b39',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 8,
  },
  float: {
    shadowColor: '#051b39',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  card: {
    shadowColor: '#051b39',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

// ── Gradients ──────────────────────────────────────────────────────────────
// Use with expo-linear-gradient
export const Gradients = {
  primaryCta: {
    colors: ['#000b21', '#0d2240'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    angle: 135,
  },
  midnightVault: {
    colors: ['#0a1525', '#000b21'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const;
