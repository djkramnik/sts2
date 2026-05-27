import { createApp } from "./app";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
  console.log(`stream the demo sim at http://localhost:${port}/sim/stream`);
});
