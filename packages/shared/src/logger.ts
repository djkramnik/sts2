export interface Logger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const formatArgument = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Error) {
    return value.stack ?? value.message;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
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

export const stringifyLogLine = (...args: unknown[]) => formatLine(...args);
