import { Client } from "discord.js";
import BotCommand from "@/models/BotCommand";

export type BotService = (
  bot: Client<true>
) => BotCommand[] | undefined;

export type BotSubService<T = undefined | BotCommand> = (
  bot: Client<true>,
  command: T
) => void;
