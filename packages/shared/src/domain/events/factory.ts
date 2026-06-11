import { EventMessageType, PrintMessage } from "./types"

export const createPrintMessage = (message: string): string => {
  const printMessage: PrintMessage = {
    type: EventMessageType.PRINT_MESSAGE,
    message,
  }
  return JSON.stringify(printMessage)
}