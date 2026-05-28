import { createApp } from "./app";
import http from 'http'

const port = Number(process.env.PORT ?? 3067);
const app = createApp();

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server listening on ${port}`)
})
