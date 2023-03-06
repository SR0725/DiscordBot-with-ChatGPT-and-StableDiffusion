import { registService, registCommands } from "./utils/bot";
import ChatGPTService from "./services/ChatGPTService";
import StableDiffusionService from "./services/StableDiffusionService";


registService(ChatGPTService);
registService(StableDiffusionService);
registCommands();
