import { Client } from "discord.js";
import BotCommand from "@/models/BotCommand";
export type BotService = (bot: Client<true>, command: BotCommand) => void;
