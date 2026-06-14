import { Request, Response, Router } from 'express'
import { createDemoSimulation } from '../sim/createDemoSimulation'
import { createLineLogger } from '../util/logger'
import { EventMessageType, initSendSimMessage, sendSimMessage } from 'shared'

const simRouter = Router()
export default simRouter

simRouter.get('/stream', async (request: Request, response: Response) => {
  response.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  response.setHeader('Cache-Control', 'no-cache, no-transform')
  response.setHeader('Connection', 'keep-alive')
  response.flushHeaders()

  let streamClosed = false
  request.on('close', () => {
    streamClosed = true
  })

  const logger = createLineLogger((line) => {
    if (streamClosed) {
      return
    }
    writeSseEvent(response, 'log', { message: line })
  })

  // initialize global send util here.
  initSendSimMessage(logger.log)

  writeSseEvent(response, 'ready', { message: 'Simulation stream opened.' })

  try {
    sendSimMessage({
      type: EventMessageType.PRINT_MESSAGE,
      message: 'sts2 simulator',
    })

    const simulation = createDemoSimulation(logger)
    await simulation.runSim()

    if (!streamClosed) {
      sendSimMessage({
        type: EventMessageType.PRINT_MESSAGE,
        message: 'sim finished',
      })
      writeSseEvent(response, 'done', { message: '' })
      response.end()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!streamClosed) {
      writeSseEvent(response, 'error', { message })
      response.end()
    }
  }
})

function writeSseEvent(response: Response, event: string, data: unknown) {
  response.write(`event: ${event}\n`)
  response.write(`data: ${JSON.stringify(data)}\n\n`)
}
