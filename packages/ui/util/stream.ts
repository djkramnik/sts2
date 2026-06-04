import {
  StreamMessageZ,
  type StreamDataMessage,
  type StreamEventMessage,
  type StreamMessage,
} from "shared";

export type StreamMessageHandlers = {
  onStreamMessage?: (message: StreamMessage) => void;
  onMessage?: (message: StreamDataMessage["message"]) => void;
  onEvent?: (event: StreamEventMessage["event"]) => void;
  onInvalidMessage?: (error: unknown, line: string) => void;
  signal?: AbortSignal;
};

export async function consumeJsonMessageStream(
  input: RequestInfo | URL,
  handlers: StreamMessageHandlers = {},
  init: RequestInit = {},
): Promise<void> {
  const response = await fetch(input, {
    ...init,
    signal: handlers.signal ?? init.signal,
  });

  if (!response.ok) {
    throw new Error(`Stream request failed with status ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Stream response did not include a readable body.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      buffer = consumeBufferedLines(buffer, handlers);
    }

    buffer += decoder.decode();
    consumeBufferedLines(buffer, handlers, true);
  } finally {
    reader.releaseLock();
  }
}

function consumeBufferedLines(
  buffer: string,
  handlers: StreamMessageHandlers,
  flush = false,
) {
  const lines = buffer.split(/\r?\n/);
  const remainder = flush ? "" : lines.pop() ?? "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }

    consumeLine(trimmed, handlers);
  }

  return remainder;
}

function consumeLine(line: string, handlers: StreamMessageHandlers) {
  let streamMessage: StreamMessage;

  try {
    streamMessage = StreamMessageZ.parse(JSON.parse(line));
  } catch (error) {
    if (handlers.onInvalidMessage) {
      handlers.onInvalidMessage(error, line);
      return;
    }

    throw error;
  }

  handlers.onStreamMessage?.(streamMessage);

  if ("message" in streamMessage) {
    handlers.onMessage?.(streamMessage.message);
    return;
  }

  handlers.onEvent?.(streamMessage.event);
}
