import BotCommand from "@/models/BotCommand";
import { BotService, BotSubService } from "@/models/BotService";
import chatWithGPT, { Message, resetHistory } from "@/utils/chatGPT";
import embed from "@/utils/embed";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import useSystemPrompt from "@/utils/systemPrompt";

const systemPromptGetCommand = new SlashCommandBuilder()
  .setName("取得催眠詞")
  .setDescription("取得 ChatGPT 的催眠詞")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const systemPromptGetSubService: BotSubService<BotCommand> = (bot, command) => {
  const { getPrompt } = useSystemPrompt();

  bot.on("interactionCreate", async (interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === command.name) {
        await interaction.reply(getPrompt());
      }
    } catch (error) {
      console.error(error);
    }
  });
};

const systemPromptSetCommand = new SlashCommandBuilder()
  .setName("設定催眠詞")
  .setDescription("設定 ChatGPT 的催眠詞")
  .addStringOption((option: any) =>
    option.setName("prompt").setDescription("催眠詞").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const systemPromptSetSubService: BotSubService<BotCommand> = (bot, command) => {
  const { setPrompt } = useSystemPrompt();

  bot.on("interactionCreate", async (interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === command.name) {
        const newSystemPrompt = interaction.options.getString(
          "prompt"
        ) as string;
        setPrompt(newSystemPrompt);
        await interaction.reply("已修正對機器人的催眠");
      }
    } catch (error) {
      console.error(error);
    }
  });
};

const historyClearCommand: BotCommand = {
  name: "清除歷史紀錄",
  description: "清除歷史紀錄",
};

const historyClearSubService: BotSubService<BotCommand> = (bot, command) => {
  bot.on("interactionCreate", async (interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === command.name) {
        resetHistory(interaction.user.id);
        await interaction.reply("已清除你的歷史紀錄，請重新開始對話");
      }
    } catch (error) {
      console.error(error);
    }
  });
};

const chatSubService: BotSubService = (bot) => {
  const { getPrompt } = useSystemPrompt();

  bot.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!("sendTyping" in message.channel)) return;

    if (message.content.startsWith(`<@${bot.user.id}>`)) {
      const rawInput = message.content.replace(`<@${bot.user.id}>`, "");
      if (!rawInput) {
        await message.reply({
          embeds: [embed("error")("請輸入文字")],
        });
        return;
      }
      await message.channel.sendTyping();
      try {
        const systemMessage = {
          role: "system",
          content: getPrompt(),
        };
        const reply = await chatWithGPT({
          prompt: rawInput,
          userId: message.author.id,
          withHistory: true,
          systemMessage: systemMessage as Message,
        });
        await message.reply({
          embeds: [embed("success")(reply)],
        });
      } catch (error) {
        await message.reply({
          embeds: [embed("error")("發生了未知的錯誤，ChatGPT拒絕回應")],
        });
        console.error(error);
      }
    }
  });
};

const service: BotService = (bot) => {
  systemPromptSetSubService(bot, systemPromptSetCommand);
  systemPromptGetSubService(bot, systemPromptGetCommand);
  historyClearSubService(bot, historyClearCommand);
  chatSubService(bot, undefined);

  return [systemPromptSetCommand, systemPromptGetCommand, historyClearCommand];
};

export default service;
