import { consoleLogger as sharedConsoleLogger, stringifyLogLine } from "shared";

export type { Logger } from "shared";
export const consoleLogger = sharedConsoleLogger;

// Preserve the server-side line logger while sharing the core logger contract.
export const createLineLogger = (writeLine: (line: string) => void) => {
  return {
    log: (...args: unknown[]) => {
      writeLine(stringifyLogLine(...args));
    },
    error: (...args: unknown[]) => {
      writeLine(stringifyLogLine(...args));
    },
  };
};
