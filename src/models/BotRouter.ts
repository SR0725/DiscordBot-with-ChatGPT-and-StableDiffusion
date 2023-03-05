import BotCommand from "@/models/BotCommand";
import { BotService } from "@/models/BotService";

export interface BotRouter {
  command: BotCommand;
  service: BotService;
}
export type BotRouters = Map<BotRouter["command"], BotRouter["service"]>;
