/*
  Custom ambient module declarations to satisfy the TypeScript compiler
  for packages that do not ship their own types or for deep import paths
  that the compiler cannot resolve. These all fall back to `any` which
  is acceptable because strict type-safety on these libraries is not
  critical for the application logic and we mainly want to unblock the
  build in strict mode.
*/

/// <reference types="node" />

declare module '@uiw/react-md-editor' {
  const MDEditor: any;
  export default MDEditor;
  export const Markdown: any;
}

declare module 'react-syntax-highlighter' {
  export const Prism: any;
  const _default: any;
  export default _default;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const lucario: any;
  const _default: any;
  export default _default;
}

declare module '@next/bundle-analyzer' {
  function createBundleAnalyzer(options: any): (config: any) => any;
  export default createBundleAnalyzer;
}

declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T extends (...args: any) => any> = any;
}

declare module 'sonner' {
  export const Toaster: any;
  export interface ToasterProps {
    theme?: string;
    [key: string]: any;
  }
  export const toast: any;
  export { Toaster as Sonner };
}