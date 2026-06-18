import { TurnSummaryMessage } from "shared";

export const TurnSummaryMessageElem = (message: TurnSummaryMessage) => {
  return <p>HI ! {JSON.stringify(message)}</p>
}