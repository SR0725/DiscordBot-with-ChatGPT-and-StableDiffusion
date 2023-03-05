import ChatGPTService from "@/services/ChatGPTService";
import { BotRouter, BotRouters } from "@/models/BotRouter";

const chatGPT: BotRouter = {
  command: {
    name: "清除歷史紀錄",
    description: "清除歷史紀錄",
  },
  service: ChatGPTService,
};

const chatGPTRouter: BotRouters = new Map();
chatGPTRouter.set(chatGPT.command, chatGPT.service);

export default chatGPTRouter;
