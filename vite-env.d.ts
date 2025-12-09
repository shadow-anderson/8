
interface ImportMetaEnv {
  readonly VITE_GOOGLE_AI_STUDIO_API: string;
  readonly VITE_GOOGLE_AI_MODEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}