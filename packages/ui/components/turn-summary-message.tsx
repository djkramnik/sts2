import { PlayerStatusMessage, TurnSummaryMessage } from 'shared'
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Deck } from './card'

export const TurnSummaryMessageElem = (message: TurnSummaryMessage) => {
  return (
    <Card sx={{ padding: 3 }}>
      <Typography fontWeight={600} component="h2">
        Turn: {Math.floor(message.idx / 2) + 1}
        {message.idx % 2 ? 'b' : 'a'}
      </Typography>
      {/* player statuses at start of this turn  */}
      <Box sx={{ display: 'flex', gap: '8px', padding: '12px' }}>
        <PlayerStatus {...message.before[0]} />
        <PlayerStatus {...message.before[1]} />
      </Box>

      <PlayerIcon
        player={message.playerToMove}
      />
      <Deck
        highlights={message.moves.map((m) => m.id)}
        cards={message.playerToMoveHand}
      />
      {/* table of Card Effects for each card played, in order */}
      {/* card effects means the changes to player status per card played */}
      <Table>
        {message.moves.map((_, idx) => {
          return (
            <TableRow>
              <TableCell>Move #{idx}</TableCell>
              <TableCell>
                <PlayerCardEffects
                  name={message.playerToMove}
                  effects={message.effects[idx]}
                />
              </TableCell>
              <TableCell>
                <PlayerCardEffects
                  name={message.otherPlayer}
                  effects={message.effects[idx]}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </Table>
    </Card>
  )
}

function PlayerIcon({
  player,
  size = 30,
}: {
  player: string
  size?: number
}) {
  return (
    <img
      alt={player}
      style={{ width: `${size}px` }}
      src={`/assets/player/${player + '.webp'}`}
    />
  )
}

function PlayerCardEffects({
  name,
  effects
}: {
  effects: TurnSummaryMessage['effects'][0]
  name: string
}) {
  const playerEffects: TurnSummaryMessage['effects'][0] = Object.entries(effects).reduce((acc, [k, v]) => {
    if (k === name) {
      return {
        ...acc,
        [k]: v,
      }
    }
    return acc
  }, {})
  const blockEffect = playerEffects[name].block
  const hpEffect = playerEffects[name].hp
  if (!blockEffect && !hpEffect) {
    return null
  }
  return (
    <Table>
      <TableRow>
        <TableCell><PlayerIcon player={name} /></TableCell>
        {
          blockEffect
            ? (
              <TableCell>block: {blockEffect}</TableCell>
            )
            : null
        }
        {
          hpEffect
            ? (
              <TableCell>hp: {hpEffect}</TableCell>
            )
            : null
        }
      </TableRow>
    </Table>
  )
}

function PlayerStatus(ps: TurnSummaryMessage['before'][0]) {
    return (
    <Table>
      <TableRow>
        <TableCell><PlayerIcon player={ps.name} /></TableCell>
        <TableCell>mana: {ps.mana}</TableCell>
        <TableCell>block: {ps.block}</TableCell>
        <TableCell>hp: {ps.hp}</TableCell>
      </TableRow>
    </Table>
  )
}

