import { z } from "zod";
import { SerializableCardZ } from "./card";

export const PlayerStateZ = z.object({
  maxHp: z.number(),
  hp: z.number(),
  mana: z.number(),
  deck: z.array(SerializableCardZ),
  block: z.number(),
});

export type PlayerState = z.infer<typeof PlayerStateZ>;

export const SerializablePlayerZ = z.object({
  enemy: z.boolean(),
  name: z.string(),
  maxHp: z.number(),
  hp: z.number(),
  mana: z.number(),
  deck: z.array(SerializableCardZ),
  drawPile: z.array(SerializableCardZ),
  discardPile: z.array(SerializableCardZ),
  hand: z.array(SerializableCardZ),
  block: z.number(),
  base: PlayerStateZ,
});

export type SerializablePlayer = z.infer<typeof SerializablePlayerZ>;

export { Player } from "./domain/entities/player";
