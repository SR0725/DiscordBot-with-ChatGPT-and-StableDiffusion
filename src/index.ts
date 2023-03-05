import { registService, registCommand } from "./utils/bot";
import HealthCheckRouter from "./routes/HealthCheckRouter";
import ChatGPTRouter from "./routes/ChatGPTRouter";
import StableDiffusionRouter from "./routes/StableDiffusionRouter";

registService(HealthCheckRouter);
registService(ChatGPTRouter);
registService(StableDiffusionRouter);
registCommand();
