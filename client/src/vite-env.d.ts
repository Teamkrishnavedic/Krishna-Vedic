/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORE_NAME?: string;
  readonly VITE_STORE_EMAIL?: string;
  readonly VITE_STORE_ORDERS_EMAIL?: string;
  readonly VITE_STORE_PHONE?: string;
  readonly VITE_STORE_PHONE_ALT?: string;
  readonly VITE_STORE_ADDRESS?: string;
  readonly VITE_STORE_HOURS?: string;
  readonly VITE_STORE_FSSAI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
