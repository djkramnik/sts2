import { createDemoSimulation } from "./sim/createDemoSimulation";
import { consoleLogger } from "./util/logger";

const main = async () => {
  consoleLogger.log("sts2 simulator");
  const simulation = createDemoSimulation(consoleLogger);
  await simulation.runSim();
};

main().catch((error) => {
  consoleLogger.error(error);
  process.exitCode = 1;
});
