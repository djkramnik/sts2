// within the sse payload, these exist within message as a string that will
// be parsed on the client, validated and then processed

import z from "zod";

// this should be in the same folder as the player entity..
// but for now dumping all schemas to be conveyed over streaming endpoint in this file
export const PlayerStatusMessageZ = z.object({
  name: z.string(),
  hp: z.number(),
  maxHp: z.number(),
  mana: z.number(),
  block: z.number()
})

export type PlayerStatusMessage = {
  name: string
  hp: number
  maxHp: number
  mana: number
  block: number
}
;({}) as PlayerStatusMessage satisfies z.infer<typeof PlayerStatusMessageZ>

export const MatchStartMessageZ = z.object({
  idx: z.number(),
  playerName: z.string(),
  enemyName: z.string(),
})

export type MatchStartMessage = {
  idx: number
  playerName: string
  enemyName: string
}

;({} as MatchStartMessage satisfies z.infer<typeof MatchStartMessageZ>)

export const TurnStartMessageZ = z.object({
  idx: z.number()
})
export type TurnStartMessage = {
  idx: number
}
;({} as TurnStartMessage satisfies z.infer<typeof TurnStartMessageZ>)

export const CardMessageZ = z.object({
  uuid: z.string(),
  name: z.string(),
  cost: z.number(),
  attack: z.number().optional(),
  defense: z.number().optional(),
})
export type CardMessage = {
  uuid: string
  name: string
  cost: number
  attack: number
  defense: number
}
;({} as CardMessage satisfies z.infer<typeof CardMessageZ>)

export const PlayerHandMessageZ = z.object({
  hand: z.array(CardMessageZ)
})

export type PlayerHandMessage = {
  hand: CardMessage[]
}
;({} as PlayerHandMessage satisfies z.infer<typeof PlayerHandMessageZ>)

export const PlayerMoveMessageZ = z.object({
  card: CardMessageZ
})

export type PlayerMoveMessage = {
  card: CardMessage
}
;({} as PlayerMoveMessage satisfies z.infer<typeof PlayerMoveMessageZ>)
