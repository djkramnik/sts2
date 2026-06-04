import express from 'express'
import http from 'http'
import simRouter from './routes/sim';

const port = Number(process.env.PORT ?? 3067);
const app = express();

app.use('/api/sim', simRouter)


const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server listening on ${port}`)
})
