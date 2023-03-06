import {BotService} from "@/models/BotService";
import BotCommand from "@/models/BotCommand";
import { REST, Routes, Client, GatewayIntentBits } from "discord.js";

const bot = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN as string
);

export function registService(botService: BotService) {
  addCommands(botService(bot));
}

const commands: BotCommand[] = [];
function addCommands(newCommands?: BotCommand[]) {
  if(!newCommands) return;
  commands.push(...newCommands);
}

export async function registCommands() {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_BLOT_CLIENT_ID as string),
      {
        body: commands,
      }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

bot.login(process.env.DISCORD_BOT_TOKEN as string);

bot.on("ready", () => {
  if (!bot.user) return console.log("Bot user is not defined");
  console.log(`Logged in as ${bot.user.tag}!`);
});
