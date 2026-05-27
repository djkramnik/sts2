import express, { Request, Response } from "express";
import { createDemoSimulation } from "./sim/createDemoSimulation";
import { createLineLogger } from "./util/logger";

const writeSseEvent = (response: Response, event: string, data: unknown) => {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(data)}\n\n`);
};

export const createApp = () => {
  const app = express();

  app.get("/sim/stream", async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache, no-transform");
    response.setHeader("Connection", "keep-alive");
    response.flushHeaders();

    let streamClosed = false;
    request.on("close", () => {
      streamClosed = true;
    });

    const logger = createLineLogger((line) => {
      if (streamClosed) {
        return;
      }
      writeSseEvent(response, "log", { message: line });
    });

    writeSseEvent(response, "ready", { message: "Simulation stream opened." });

    try {
      logger.log("sts2 simulator");
      const simulation = createDemoSimulation(logger);
      await simulation.runSim();

      if (!streamClosed) {
        writeSseEvent(response, "done", { message: "Simulation finished." });
        response.end();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!streamClosed) {
        writeSseEvent(response, "error", { message });
        response.end();
      }
    }
  });

  return app;
};
