import HealthCheckService from "@/services/HealthCheckService";
import { BotRouter, BotRouters } from "@/models/BotRouter";

const healthCheck: BotRouter = {
  command: {
    name: "health-check",
    description: "Check the health of the bot",
  },
  service: HealthCheckService,
};


const healthCheckRouter: BotRouters = new Map();
healthCheckRouter.set(healthCheck.command, healthCheck.service);

export default healthCheckRouter;
