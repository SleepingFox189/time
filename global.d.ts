// Add TypeScript interface for global particlesJS function
interface Window {
  particlesJS: (id: string, config: any) => void;
}