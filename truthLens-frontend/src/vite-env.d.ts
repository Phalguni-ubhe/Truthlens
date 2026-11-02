/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Add any other env variables you have here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}