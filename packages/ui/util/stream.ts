import { z } from "zod";

const SimStreamPayloadZ = z.object({
  message: z.string(),
}).strict();

export type SimStreamPayload = z.infer<typeof SimStreamPayloadZ>;

export type SimStreamEventType = "ready" | "log" | "done" | "error";

export type SimStreamEvent = {
  type: SimStreamEventType;
  data: SimStreamPayload;
};

export type SimStreamHandlers = {
  onEvent?: (event: SimStreamEvent) => void;
  onReady?: (data: SimStreamPayload) => void;
  onLog?: (data: SimStreamPayload) => void;
  onDone?: (data: SimStreamPayload) => void;
  onError?: (data: SimStreamPayload) => void;
  onConnectionError?: (event: Event) => void;
  onInvalidEvent?: (error: unknown, event: MessageEvent<string>) => void;
  signal?: AbortSignal;
};

export function consumeSimStream(
  input: string | URL,
  handlers: SimStreamHandlers = {},
): EventSource {
  const source = new EventSource(input.toString());
  const close = () => source.close();

  if (handlers.signal?.aborted) {
    close();
    return source;
  }

  handlers.signal?.addEventListener("abort", close, { once: true });

  addSimStreamEventListener(source, "ready", handlers);
  addSimStreamEventListener(source, "log", handlers);
  addSimStreamEventListener(source, "done", handlers, close);

  source.addEventListener("error", (event) => {
    if (!isMessageEvent(event)) {
      handlers.onConnectionError?.(event);
      return;
    }

    handleSimStreamEvent("error", event, handlers);
    close();
  });

  return source;
}

function addSimStreamEventListener(
  source: EventSource,
  type: Exclude<SimStreamEventType, "error">,
  handlers: SimStreamHandlers,
  afterEvent?: () => void,
) {
  source.addEventListener(type, (event) => {
    handleSimStreamEvent(type, event, handlers);
    afterEvent?.();
  });
}

function handleSimStreamEvent(
  type: SimStreamEventType,
  event: MessageEvent<string>,
  handlers: SimStreamHandlers,
) {
  let data: SimStreamPayload;

  try {
    data = SimStreamPayloadZ.parse(JSON.parse(event.data));
  } catch (error) {
    if (handlers.onInvalidEvent) {
      handlers.onInvalidEvent(error, event);
      return;
    }

    throw error;
  }

  const simEvent: SimStreamEvent = { type, data };
  handlers.onEvent?.(simEvent);

  if (type === "ready") {
    handlers.onReady?.(data);
    return;
  }

  if (type === "log") {
    handlers.onLog?.(data);
    return;
  }

  if (type === "done") {
    handlers.onDone?.(data);
    return;
  }

  handlers.onError?.(data);
}

function isMessageEvent(event: Event): event is MessageEvent<string> {
  return "data" in event && typeof (event as MessageEvent).data === "string";
}
