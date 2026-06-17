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
import { SimulationMessage, PrintMessage, EventMessageType, MatchBoundaryMessage, TurnBoundaryMessage, PlayerHandMessage, PlayerStatusMessage } from "shared";
import { Capitalize } from "./capitalize";
import { Deck } from "./card";

export const SimMessage = ({ message }: { message: SimulationMessage}) => {
  switch (message.type) {
    case EventMessageType.PRINT_MESSAGE:
      return <PrintMessageElem {...message} />
    case EventMessageType.MATCH_BOUNDARY:
      return <MatchBoundaryElem {...message} />
    case EventMessageType.TURN_BOUNDARY:
      return <TurnBoundaryElem { ...message } />
    case EventMessageType.PLAYER_HAND:
      return <PlayerHandElem { ...message } />
    case EventMessageType.PLAYER_STATUS:
      return <PlayerStatusElem { ...message} />
    default:
      return <p>{JSON.stringify(message)}</p>
  }
}

function PrintMessageElem({ message }: PrintMessage) {
  return (
    <Typography fontWeight={600}>{message}</Typography>
  )
}

function MatchBoundaryElem({ kind }: MatchBoundaryMessage) {
  return (
    <Typography component="h2" fontWeight={600} fontSize="24px">
      Match <Capitalize>{kind}</Capitalize>
    </Typography>
  )
}

function TurnBoundaryElem({ kind, idx }: TurnBoundaryMessage) {
  return (
    <Typography component="h2" fontWeight={600} fontSize="24px">
      Turn #{idx + 1} <Capitalize>{kind}</Capitalize>
    </Typography>
  )
}

function PlayerHandElem({ handType, hand }: PlayerHandMessage) {
  return (
    <Card sx={{ padding: 2}}>
      <Typography fontWeight={600}>Player To Move: <Capitalize>{handType}</Capitalize> Pile</Typography>
      <Deck cards={hand} />
    </Card>
  )
}

function PlayerStatusElem(ps: PlayerStatusMessage) {
  const playerStatusRows = [
    { label: 'Type', value: ps.type },
    { label: 'Name', value: ps.name },
    { label: 'HP', value: ps.hp },
    { label: 'Max HP', value: ps.maxHp },
    { label: 'Mana', value: ps.mana },
    { label: 'Block', value: ps.block },
    { label: 'Enemy', value: ps.enemy ? 'true' : 'false' },
  ]

  return (
    <Card sx={{ padding: 2}}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img
          alt={ps.name}
          style={{ width: '30px' }}
          src={`/assets/${ps.enemy ? 'enemies' : 'player'}/${ps.name + '.webp'}`}
        />
        <Table size="small" sx={{ width: 'fit-content' }}>
          <TableHead>
            <TableRow>
              {playerStatusRows.map(({ label }) => (
                <TableCell key={label} sx={{ fontWeight: 600 }}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {playerStatusRows.map(({ label, value }) => (
                <TableCell key={label}>{value}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Card>
  )
}
