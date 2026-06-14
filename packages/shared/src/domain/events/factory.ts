import { SimulationMessage } from "./types"

let _sendSimMessage: null | ((event: SimulationMessage) => void) = null
export const initSendSimMessage = (log: (...args: unknown[]) => void) => {
  _sendSimMessage = (event: SimulationMessage) => {
    log(JSON.stringify(event))
  }
}

export const sendSimMessage = (event: SimulationMessage) => {
  if (!_sendSimMessage) {
    console.warn('SIM MESSAGE SEND NOT INITIALIZED')
    return
  }
  _sendSimMessage(event)
}