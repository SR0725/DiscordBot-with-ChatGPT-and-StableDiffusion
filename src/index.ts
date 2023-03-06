import { registService, registCommands } from "./utils/bot";
import ChatGPTService from "./services/ChatGPTService";

registService(ChatGPTService);
registCommands();
