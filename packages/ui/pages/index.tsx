import { NextPage } from 'next'
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { eventMessageParser, SimulationMessage } from 'shared'
import { useCallback, useEffect, useRef, useState } from 'react'
import { consumeSimStream } from '../util/stream'
import { SimMessage } from '../components/sim-message'

let simStream: EventSource | null = null
let simStreamCloseTimer: ReturnType<typeof setTimeout> | null = null

const HomePage: NextPage = () => {
  const [simMessages, setSimMessages] = useState<SimulationMessage[]>([])
  const [simIndex, setSimIndex] = useState<number>(-1)
  const [showAllSimMessages, setShowAllSimMessages] = useState<boolean>(false)
  const shouldScrollToLatestRef = useRef<boolean>(false)

  const handleIncrementState = useCallback(() => {
    if (simIndex < simMessages.length - 1) {
      shouldScrollToLatestRef.current = true
      setSimIndex(simIndex + 1)
    }
  }, [setSimIndex, simMessages, simIndex])

  const handleResetSimIndex = useCallback(() => {
    setSimIndex(0)
  }, [setSimIndex])

  const handleShowAllSimMessagesChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        shouldScrollToLatestRef.current = true
      }
      setShowAllSimMessages(checked)
    },
    [setShowAllSimMessages],
  )

  const visibleSimMessages = showAllSimMessages
    ? simMessages
    : simIndex >= 0
      ? simMessages.slice(0, simIndex + 1)
      : []

  useEffect(() => {
    if (!shouldScrollToLatestRef.current) {
      return
    }

    shouldScrollToLatestRef.current = false
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: Number.MAX_SAFE_INTEGER,
          behavior: 'auto',
        })
      })
    })
  }, [simIndex, visibleSimMessages.length])

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
          setSimMessages((messages) => messages.concat(incomingMessage))
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
      <Box
        sx={{
          position: 'fixed',
          backgroundColor: '#eee',
          width: '100vw',
          zIndex: 2
        }}
      >
        <Container maxWidth="md" sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          padding: 2,
          flexWrap: 'wrap',
          width: '100%'
        }}>
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
                onChange={(event) => handleShowAllSimMessagesChange(event.target.checked)}
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
        </Container>
      </Box>
      <Box height={56} />
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          py: 3,
        }}
      >
        {/* <Deck cards={deckOCards} /> */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {visibleSimMessages.map((m, index) => (
            <Box key={index}>
              <SimMessage message={m} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default HomePage
