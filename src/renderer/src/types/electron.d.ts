export {};

declare global {
  interface Window {
    ipcRenderer: {
      invoke: (
        channel: string,
        ...args: unknown[]
      ) => Promise<any>;

      getDemoRoot: () => Promise<string>;

      ensureDemoFolder: () => Promise<{
        success: boolean;
        path?: string;
        error?: string;
      }>;

      backendRequest: (
        request: Record<string, unknown>,
      ) => Promise<any>;
    };
  }
}