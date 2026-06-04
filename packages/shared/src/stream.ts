import { z } from "zod";

const StreamRecordZ = z.record(z.string(), z.unknown());

export const StreamDataMessageZ = z.object({
  message: StreamRecordZ,
}).strict();

export type StreamDataMessage = z.infer<typeof StreamDataMessageZ>;

const StreamEventZ = z.intersection(
  z.object({
    name: z.string(),
  }),
  StreamRecordZ,
);

export const StreamEventMessageZ = z.object({
  event: StreamEventZ,
}).strict();

export type StreamEventMessage = z.infer<typeof StreamEventMessageZ>;

export const StreamMessageZ = z.union([
  StreamDataMessageZ,
  StreamEventMessageZ,
]);

export type StreamMessage = z.infer<typeof StreamMessageZ>;
