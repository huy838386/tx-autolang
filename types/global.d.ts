// Global type declarations

interface Window {
  __i18n_t(key: string): string | null;
  __i18n_tReplace(key: string, replacements: Record<string, string>): string;
}
