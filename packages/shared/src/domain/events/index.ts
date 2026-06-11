import { EventMessageType, MatchBoundaryMessageZ, PlayerHandMessageZ, PlayerMoveMessageZ, PlayerStatusMessageZ, PrintMessageZ, SimulationMessage, TurnBoundaryMessageZ } from "./types"

export * from './factory'
export * from './types'

export const eventMessageParser = (message: string): SimulationMessage | null => {
  let obj: { type: EventMessageType } | null = null
  try {
    obj = JSON.parse(message)
    if (!obj) {
      return null
    }
  } catch {
    console.warn('unparseable message event string', message)
    return null
  }
  switch(obj.type) {
    case EventMessageType.MATCH_BOUNDARY:
      const maybeMatchBoundary = MatchBoundaryMessageZ.safeParse(obj)
      return maybeMatchBoundary.data ?? null
    case EventMessageType.PLAYER_HAND:
      const maybePlayerHand = PlayerHandMessageZ.safeParse(obj)
      return maybePlayerHand.data ?? null
    case EventMessageType.PLAYER_MOVE:
      const maybePlayerMove = PlayerMoveMessageZ.safeParse(obj)
      return maybePlayerMove.data ?? null
    case EventMessageType.PLAYER_STATUS:
      const maybePlayerStatus = PlayerStatusMessageZ.safeParse(obj)
      return maybePlayerStatus.data ?? null
    case EventMessageType.TURN_BOUNDARY:
      const maybeTurnBoundary = TurnBoundaryMessageZ.safeParse(obj)
      return maybeTurnBoundary.data ?? null
    case EventMessageType.PRINT_MESSAGE:
      const maybePrintMessage = PrintMessageZ.safeParse(obj)
      return maybePrintMessage.data ?? null
    default:
      console.warn('unrecognized event message type', obj.type)
      return null
  }
}