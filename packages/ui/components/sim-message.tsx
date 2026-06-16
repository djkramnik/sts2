import { Typography } from "@mui/material";
import { SimulationMessage, PrintMessage, EventMessageType, MatchBoundaryMessage } from "shared";

export const SimMessage = ({ message }: { message: SimulationMessage}) => {
  switch (message.type) {
    case EventMessageType.PRINT_MESSAGE:
      return <PrintMessageElem {...message} />
    case EventMessageType.MATCH_BOUNDARY:
      return <MatchBoundaryElem {...message} />
    default:
      return <p>{JSON.stringify(message)}</p>
  }
}

function PrintMessageElem({ message }: PrintMessage) {
  return (
    <Typography fontWeight={600}>{message}</Typography>
  )
}

function MatchBoundaryElem({ kind}: MatchBoundaryMessage) {
  return (
    <Typography component="h2" fontWeight={600} fontSize="24px">
      Match <span style={{ textTransform: 'capitalize' }}>
        {kind}
        </span>
    </Typography>
  )
}
