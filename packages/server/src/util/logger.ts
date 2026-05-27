import { inspect } from "node:util";

export interface Logger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const formatArgument = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  return inspect(value, {
    depth: null,
    colors: false,
  });
};

const formatLine = (...args: unknown[]) => args.map(formatArgument).join(" ");

export const consoleLogger: Logger = {
  log: (...args) => {
    console.log(...args);
  },
  error: (...args) => {
    console.error(...args);
  },
};

export const createLineLogger = (writeLine: (line: string) => void): Logger => {
  return {
    log: (...args) => {
      writeLine(formatLine(...args));
    },
    error: (...args) => {
      writeLine(formatLine(...args));
    },
  };
};
