// within the sse payload, these exist within message as a string that will
// be parsed on the client, validated and then processed

import z from "zod";
import { SerializableCardZ, type SerializableCard } from "../../card";

export enum EventMessageType {
  TURN_SUMMARY = 'TURN_SUMMARY',
  PLAYER_STATUS = 'PLAYER_STATUS',
  MATCH_BOUNDARY = 'MATCH_BOUNDARY',
  TURN_BOUNDARY = 'TURN_BOUNDARY',
  PLAYER_HAND = 'PLAYER_HAND',
  PLAYER_MOVE = 'PLAYER_MOVE',
  PRINT_MESSAGE = 'PRINT_MESSAGE' // informational only.  purely for console.log
}

export type SimulationMessage =
  | TurnSummaryMessage
  | PlayerStatusMessage
  | MatchBoundaryMessage
  | TurnBoundaryMessage
  | PlayerHandMessage
  | PlayerMoveMessage
  | PrintMessage

export const PrintMessageZ = z.object({
  type: z.literal(EventMessageType.PRINT_MESSAGE),
  message: z.string()
})
export type PrintMessage = {
  type: EventMessageType.PRINT_MESSAGE,
  message: string
}
;({} as PrintMessage satisfies z.infer<typeof PrintMessageZ>)

// this should be in the same folder as the player entity..
// but for now dumping all schemas to be conveyed over streaming endpoint in this file
export const PlayerStatusMessageZ = z.object({
  type: z.literal(EventMessageType.PLAYER_STATUS),
  name: z.string(),
  hp: z.number(),
  maxHp: z.number(),
  mana: z.number(),
  block: z.number(),
  enemy: z.boolean()
})

export type PlayerStatusMessage = {
  type: EventMessageType.PLAYER_STATUS,
  name: string
  hp: number
  maxHp: number
  mana: number
  block: number
  enemy: boolean
}
;({}) as PlayerStatusMessage satisfies z.infer<typeof PlayerStatusMessageZ>

const BoundaryKindZ = z.union([z.literal('start'), z.literal('end')])
type BoundaryKind = | 'start' | 'end'
;({} as BoundaryKind satisfies z.infer<typeof BoundaryKindZ>)

export const MatchBoundaryMessageZ = z.object({
  type: z.literal(EventMessageType.MATCH_BOUNDARY),
  idx: z.number(),
  playerName: z.string(),
  enemyName: z.string(),
  kind: BoundaryKindZ,
  winnerName: z.string().optional(),
})

export type MatchBoundaryMessage = {
  type: EventMessageType.MATCH_BOUNDARY,
  idx: number
  playerName: string
  enemyName: string
  kind: BoundaryKind
  winnerName?: string
}

;({} as MatchBoundaryMessage satisfies z.infer<typeof MatchBoundaryMessageZ>)

export const TurnBoundaryMessageZ = z.object({
  type: z.literal(EventMessageType.TURN_BOUNDARY),
  idx: z.number(),
  kind: BoundaryKindZ
})
export type TurnBoundaryMessage = {
  type: EventMessageType.TURN_BOUNDARY,
  idx: number
  kind: BoundaryKind
}
;({} as TurnBoundaryMessage satisfies z.infer<typeof TurnBoundaryMessageZ>)

export const PlayerHandMessageZ = z.object({
  type: z.literal(EventMessageType.PLAYER_HAND),
  hand: z.array(SerializableCardZ),
  handType: z.union([z.literal('hand'), z.literal('draw'), z.literal('discard')])
})

export type PlayerHandMessage = {
  type: EventMessageType.PLAYER_HAND,
  hand: SerializableCard[]
  handType: | 'hand' | 'draw' | 'discard'
}
;({} as PlayerHandMessage satisfies z.infer<typeof PlayerHandMessageZ>)

export const PlayerMoveMessageZ = z.object({
  type: z.literal(EventMessageType.PLAYER_MOVE),
  card: SerializableCardZ
})

export type PlayerMoveMessage = {
  type: EventMessageType.PLAYER_MOVE,
  card: SerializableCard
}
;({} as PlayerMoveMessage satisfies z.infer<typeof PlayerMoveMessageZ>)


// turn summary saga
const CardEffectZ = z.object({
  block: z.number().optional(),
  hp: z.number().optional()
})
type CardEffect = Partial<Pick<PlayerStatusMessage, 'block' | 'hp'>>

export const TurnSummaryMessageZ = z.object({
  type: z.literal(EventMessageType.TURN_SUMMARY),
  playerToMove: z.string(),
  turn: z.array(SerializableCardZ),
  effects: z.record(z.string(), CardEffectZ), // key is player name
  before: z.array(PlayerStatusMessageZ),
  after: z.array(PlayerStatusMessageZ)
})

export type TurnSummaryMessage = {
  type: EventMessageType.TURN_SUMMARY
  playerToMove: string
  turn: SerializableCard[]
  effects: Record<string, CardEffect>
  before: PlayerStatusMessage[]
  after: PlayerStatusMessage[]
}

;({} as TurnSummaryMessage satisfies z.infer<typeof TurnSummaryMessageZ>)