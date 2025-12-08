/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_AI_STUDIO_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
