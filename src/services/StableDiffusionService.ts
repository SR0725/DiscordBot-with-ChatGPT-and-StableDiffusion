import { BotService } from "@/models/BotService";
import { render } from "@/utils/stableDiffusion";
import chatWithGPT, { Message } from "@/utils/chatGpt";

const renderMessage = {
  role: "system",
  content:
    "Stable Diffusion 是一個類似於DALLE-2的AI藝術生成模型。" +
    "以下是可以用來生成Stable Diffusion圖像的提示，你可以參考看看：" +
    "- portait of a homer simpson archer shooting arrow at forest monster, front game card, drark, marvel comics, dark, intricate, highly detailed, smooth, artstation, digital illustration by ruan jia and mandy jurgens and artgerm and wayne barlowe and greg rutkowski and zdislav beksinski" +
    "- pirate, concept art, deep focus, fantasy, intricate, highly detailed, digital painting, artstation, matte, sharp focus, illustration, art by magali villeneuve, chippy, ryan yee, rk post, clint cearley, daniel ljunggren, zoltan boros, gabor szikszai, howard lyon, steve argyle, winona nelson" +
    "- ghost inside a hunted room, art by lois van baarle and loish and ross tran and rossdraws and sam yang and samdoesarts and artgerm, digital art, highly detailed, intricate, sharp focus, Trending on Artstation HQ, deviantart, unreal engine 5, 4K UHD image" +
    "I want you to write me a list of detailed prompts exactly about the idea written after IDEA. Follow the structure of the example prompts. This means a very short description of the scene, followed by modifiers divided by commas to alter the mood, style, lighting, and more." +
    "我希望你能根據下面的IDEA，精確地撰寫關於該IDEA的英文詳細提示。請遵循範例提示的結構，即簡短描述場景，然後使用逗號分隔的修飾語改變情緒、風格、燈光等等。" +
    "並且請直接給我英文指令，不需要其他多餘的文字以及解釋，只需要給一個指令幾可,",
};
const service: BotService = (bot, command) => {
  bot.on("interactionCreate", async (interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === command.name) {
        const prompt = interaction.options.getString("prompt");
        if (!prompt) {
          await interaction.reply("請輸入文字");
          return;
        }
        await interaction.reply("FillCast 正在將您對圖片的敘述轉化為咒語…");

        const reply = await chatWithGPT({
          prompt,
          userId: interaction.user.id,
          withHistory: false,
          systemMessage: renderMessage as Message,
        });

        await interaction.editReply(
          "FillCast 正在繪製… \n原文:" + prompt + "\n咒術轉換:" + reply
        );
        const attachment = await render(reply);
        await interaction.editReply({
          files: [attachment],
        });
      }
    } catch (error) {}
  });
};

export default service;
