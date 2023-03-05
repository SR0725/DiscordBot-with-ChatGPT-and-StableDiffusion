import StableDiffusionService from "@/services/StableDiffusionService";
import { BotRouter, BotRouters } from "@/models/BotRouter";

import { SlashCommandBuilder } from "discord.js";

const command = new SlashCommandBuilder()
  .setName("draw")
  .setDescription("使用 stable diffusion 生成圖片")
  .addStringOption((option: any) =>
    option.setName("prompt").setDescription("輸入文字")
  );

const stableDiffusion: BotRouter = {
  command,
  service: StableDiffusionService,
};

const stableDiffusionRouter: BotRouters = new Map();
stableDiffusionRouter.set(stableDiffusion.command, stableDiffusion.service);

export default stableDiffusionRouter;
