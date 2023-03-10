import { EmbedBuilder } from "discord.js";

const colors = {
  wait: 0x2196f3,
  success: 0x4caf50,
  error: 0xf44336,
};

const embed = (type: keyof typeof colors) => (description: string) =>
  new EmbedBuilder().setColor(colors[type]).setDescription(description);

export default embed;
