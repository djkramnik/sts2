import { PlayerStatusMessage, TurnSummaryMessage } from "shared";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Deck } from "./card";

export const TurnSummaryMessageElem = (message: TurnSummaryMessage) => {
  // return <p>HI ! {JSON.stringify(message)}</p>
  return (
    <Card sx={{ padding: 3 }}>
      <Typography fontWeight={600} component="h2">
        Turn: {Math.floor(message.idx / 2) + 1}{message.idx % 2 ? 'b' : 'a'}
      </Typography>
      <PlayerIcon
        player={message.before.find(p => p.name === message.playerToMove)!}
      />
      <Deck cards={message.playerToMoveHand} />
    </Card>
  )
}

function PlayerIcon({
  player,
  size = 30
}: {
  player: PlayerStatusMessage
  size?: number
}) {
  return (
    <img
      alt={player.name}
      style={{ width: `${size}px` }}
      src={`/assets/${player.enemy ? 'enemies' : 'player'}/${player.name + '.webp'}`}
    />
  )
}
