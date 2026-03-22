/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ── Sovereign Editorial Palette ──────────────────────────────
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
      },
      fontFamily: {
        // Manrope — Display & Headlines
        'manrope': ['Manrope', 'sans-serif'],
        'manrope-light': ['Manrope_300Light', 'sans-serif'],
        'manrope-regular': ['Manrope_400Regular', 'sans-serif'],
        'manrope-medium': ['Manrope_500Medium', 'sans-serif'],
        'manrope-semibold': ['Manrope_600SemiBold', 'sans-serif'],
        'manrope-bold': ['Manrope_700Bold', 'sans-serif'],
        'manrope-extrabold': ['Manrope_800ExtraBold', 'sans-serif'],
        // Inter — Body & Labels
        'inter': ['Inter', 'sans-serif'],
        'inter-light': ['Inter_300Light', 'sans-serif'],
        'inter-regular': ['Inter_400Regular', 'sans-serif'],
        'inter-medium': ['Inter_500Medium', 'sans-serif'],
        'inter-semibold': ['Inter_600SemiBold', 'sans-serif'],
        'inter-bold': ['Inter_700Bold', 'sans-serif'],
      },
      fontSize: {
        // Display & Headline (Manrope)
        'display-lg': ['56px', { lineHeight: '64px', letterSpacing: '-1px' }],
        'display-md': ['45px', { lineHeight: '52px', letterSpacing: '-0.5px' }],
        'display-sm': ['36px', { lineHeight: '44px' }],
        'headline-lg': ['32px', { lineHeight: '40px' }],
        'headline-md': ['28px', { lineHeight: '36px' }],
        'headline-sm': ['24px', { lineHeight: '32px' }],
        // Body & Labels (Inter)
        'title-lg': ['22px', { lineHeight: '28px' }],
        'title-md': ['18px', { lineHeight: '24px', letterSpacing: '0.15px' }],
        'title-sm': ['14px', { lineHeight: '20px', letterSpacing: '0.1px' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0.5px' }],
        'body-md': ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
        'body-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.4px' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.1px' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
        'label-sm': ['11px', { lineHeight: '16px', letterSpacing: '0.5px' }],
      },
      spacing: {
        // Design token spacing scale
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '11': '44px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        // Sovereign ambient shadow — no pure-black shadows
        'ambient': '0 20px 40px rgba(5, 27, 57, 0.06)',
        'float': '0 8px 24px rgba(5, 27, 57, 0.08)',
        'card': '0 2px 8px rgba(5, 27, 57, 0.04)',
      },
    },
  },
  plugins: [],
};
