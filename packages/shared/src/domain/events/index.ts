import { EventMessageType, MatchBoundaryMessageZ, SimulationMessage, TurnBoundaryMessageZ } from "./types"

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
      const maybePlayerHand = MatchBoundaryMessageZ.safeParse(obj)
      return maybePlayerHand.data ?? null
    case EventMessageType.PLAYER_MOVE:
      const maybePlayerMove = MatchBoundaryMessageZ.safeParse(obj)
      return maybePlayerMove.data ?? null
    case EventMessageType.PLAYER_STATUS:
      const maybePlayerStatus = MatchBoundaryMessageZ.safeParse(obj)
      return maybePlayerStatus.data ?? null
    case EventMessageType.TURN_BOUNDARY:
      const maybeTurnBoundary = TurnBoundaryMessageZ.safeParse(obj)
      return maybeTurnBoundary.data ?? null
    default:
      console.warn('unrecognized event message type', obj.type)
      return null
  }
}