import { BotService } from "@/models/BotService";

const service: BotService = (bot, command) => {
  bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === command.name) {
      await interaction.reply("早安 Ray");
    }
  });
};

export default service;
