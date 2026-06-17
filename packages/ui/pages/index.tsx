import { NextPage } from 'next'
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Stack,
  Switch,
} from '@mui/material'
import { Card, eventMessageParser, SimulationMessage } from 'shared'
import { Deck } from '../components/card'
import { useCallback, useEffect, useState } from 'react'
import { consumeSimStream } from '../util/stream'
import { SimMessage } from '../components/sim-message'

let simStream: EventSource | null = null
let simStreamCloseTimer: ReturnType<typeof setTimeout> | null = null

const getRandomUUID = () => new Date().getTime().toString()

const sample = new Card(
  {
    name: "Strike",
    flavor: "A straightforward attack.",
  },
  {
    cost: 1,
    attack: 6,
    defense: 0,
  },
  getRandomUUID
)
const sample2 = new Card(
  {
    name: "Defend",
    flavor: "Basic protection.",
  },
  {
    cost: 1,
    attack: 0,
    defense: 5,
  },
  getRandomUUID
)

const deckOCards = [
  sample.serialize(),
  sample2.serialize()
]

const HomePage: NextPage = () => {
  const [simMessages, setSimMessages] = useState<SimulationMessage[]>([])
  const [simIndex, setSimIndex] = useState<number>(-1)
  const [showAllSimMessages, setShowAllSimMessages] = useState<boolean>(false)

  const handleIncrementState = useCallback(() => {
    if (simIndex < simMessages.length - 1) {
      setSimIndex(simIndex + 1)
    }
  }, [setSimIndex, simMessages, simIndex])

  const handleResetSimIndex = useCallback(() => {
    setSimIndex(0)
  }, [setSimIndex])

  const visibleSimMessages = showAllSimMessages
    ? simMessages
    : simIndex >= 0
      ? simMessages.slice(0, simIndex + 1)
      : []

  useEffect(() => {
    if (simStreamCloseTimer) {
      clearTimeout(simStreamCloseTimer)
      simStreamCloseTimer = null
    }

    if (!simStream) {
      simStream = consumeSimStream('/api/sim/stream', {
        onLog: (logPayload) => {
          const incomingMessage = eventMessageParser(logPayload.message)
          if (incomingMessage === null) {
            console.warn('UNPARSEABLE MESSAGE', logPayload)
            return
          }
          setSimMessages(messages => messages.concat(incomingMessage))
        },
        onDone: (donePayload) => {
          console.log(donePayload.message)
        },
        onError: (errorPayload) => {
          console.error(errorPayload.message)
        },
        onConnectionError: (event) => {
          console.error('Simulation stream connection error', event)
        },
        onInvalidEvent: (error) => {
          console.error('Invalid simulation stream event', error)
        },
      })
    }

    return () => {
      simStreamCloseTimer = setTimeout(() => {
        simStream?.close()
        simStream = null
        simStreamCloseTimer = null
      }, 0)
    }
  }, [setSimMessages])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50',
      }}
    >
      <Box height={8} />
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          py: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            rowGap: 1,
          }}
        >
          <Button
            variant="outlined"
            disabled={simIndex >= simMessages.length - 1}
            onClick={handleIncrementState}
            sx={{
              width: 'fit-content',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
              },
            }}
          >
            Increment
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={showAllSimMessages}
                onChange={(event) => setShowAllSimMessages(event.target.checked)}
              />
            }
            label="Show all"
          />
          <Button
            variant="outlined"
            onClick={handleResetSimIndex}
            sx={{ width: 'fit-content' }}
          >
            Reset
          </Button>
        </Stack>
        {/* <Deck cards={deckOCards} /> */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {visibleSimMessages.map((m, index) => <SimMessage key={index} message={m} />)}
        </Box>
      </Container>
    </Box>
  )
}

export default HomePage
