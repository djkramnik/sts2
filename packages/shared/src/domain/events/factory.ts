import { EventMessageType, MatchBoundaryMessage, PlayerStatusMessage, PrintMessage, TurnBoundaryMessage } from "./types"

export const createPrintMessage = (message: string): string => {
  const printMessage: PrintMessage = {
    type: EventMessageType.PRINT_MESSAGE,
    message,
  }
  return JSON.stringify(printMessage)
}

export const createMatchBoundaryMessage
  = (mb: MatchBoundaryMessage): string => JSON.stringify(mb)

export const createTurnBoundaryMessage
  = (tb: TurnBoundaryMessage): string => JSON.stringify(tb)

export const createPlayerStatusMessage
  = (p: PlayerStatusMessage): string => JSON.stringify(p)