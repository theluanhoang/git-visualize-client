export default function Page() {
  // Intentionally throw to trigger localized error page under /[locale]/error.tsx
  throw new Error('Test error (i18n): this route intentionally crashes to show [locale]/error.tsx');
}


