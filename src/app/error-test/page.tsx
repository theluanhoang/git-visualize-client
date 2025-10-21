export default function Page() {
  // Intentionally throw to trigger global error page
  throw new Error('Test error: this route intentionally crashes to show error.tsx');
}


