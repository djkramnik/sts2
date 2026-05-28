import { z } from "zod";

export const CardStateZ = z.object({
  cost: z.number(),
  attack: z.number(),
  defense: z.number(),
});

export type CardState = z.infer<typeof CardStateZ>;

export const CardMetaZ = z.object({
  name: z.string(),
  flavor: z.string(),
});

export type CardMeta = z.infer<typeof CardMetaZ>;

export const SerializableCardZ = z.object({
  id: z.string(),
  name: z.string(),
  flavor: z.string(),
  cost: z.number(),
  attack: z.number(),
  defense: z.number(),
  base: CardStateZ,
});

export type SerializableCard = z.infer<typeof SerializableCardZ>;

export { Card } from "./domain/entities/card";
