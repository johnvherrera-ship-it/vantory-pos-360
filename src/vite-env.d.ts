/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_SUPERADMIN_EMAIL: string;
  readonly VITE_DEMO_SUPERADMIN_PASSWORD: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
