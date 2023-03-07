import BotCommand from "@/models/BotCommand";
import { BotService, BotSubService } from "@/models/BotService";
import chatWithGPT, { Message } from "@/utils/chatGPT";
import { render } from "@/utils/stableDiffusion";
import { SlashCommandBuilder } from "discord.js";

const renderMessage = {
  role: "system",
  content:
    "Stable Diffusion 是一個類似於DALLE-2的AI藝術生成模型。" +
    "以下是可以用來生成Stable Diffusion圖像的提示，你可以參考看看：" +
    "- masterpiece, best quality, masterpiece, right arm in the back,good breast shape, (good forearm), underboob, (good wrist), good fabric,hair clip, half naked, elf ear, (good anatomy:1.3), good style,(slight smile), water on ground, grass, blue sky, cloud, nature,cute face, light and shadow effects, volumetric lighting, gold trim,extremely detailed CG unity 8k wallpaper, depth of field, skin details,wet, focused, (necklace:1.2), (earring1.2),(beautiful detailed eyes:1.4), reflective water" +
    "- pirate, concept art, deep focus, fantasy, intricate, highly detailed, digital painting, artstation, matte, sharp focus, illustration, art by magali villeneuve, chippy, ryan yee, rk post, clint cearley, daniel ljunggren, zoltan boros, gabor szikszai, howard lyon, steve argyle, winona nelson" +
    "- ghost inside a hunted room, art by lois van baarle and loish and ross tran and rossdraws and sam yang and samdoesarts and artgerm, digital art, highly detailed, intricate, sharp focus, Trending on Artstation HQ, deviantart, unreal engine 5, 4K UHD image" +
    "I want you to write me a list of detailed prompts exactly about the idea written after IDEA. Follow the structure of the example prompts. This means a very short description of the scene, followed by modifiers divided by commas to alter the mood, style, lighting, and more." +
    "構圖先做，再做細節，最後才做光影。prompt會按照順序生效，已經固定的結構會很難修正，如果: 紅髮, 金髮  ->  那出來的會是全紅，金色會出不來，所以在詠唱的初期定義好身體結構也很重要，如果初期骨架是歪的，後面要下很多prompt才修的回來，當 [頭 -> 五官 -> 身體骨架 -> 手腳] 都完成後，就可以開始放配件來幫助填空，例如: 項鍊 戒指 手環，最後才開始調光2. prompt有比重  比重很重要，把prompt加上()就可以提高1.1比重，要往上我建議你直接打  (prompt:比重)，例如  (blue eye:1.5)，比重不能超過1.9" +
    "我希望你能根據下面的IDEA，精確地撰寫關於該IDEA的英文詳細提示。請遵循範例提示的結構，即簡短描述場景，然後使用逗號分隔的修飾語改變情緒、風格、燈光等等。" +
    "並且請直接給我英文指令，不需要其他多餘的文字以及解釋，請只給一個指令幾可，只需一項幾可，請開始",
};

const negative_prompt =
  "lowres, bad anatomy, bad hands, text, error, missing fingers,extra digit, fewer digits, cropped, worst quality, low quality,normal quality, jpeg artifacts,signature, watermark, username, blurry,artist name, split arm, split finger, extra leg, multiple breasts,(mutated hands and fingers:1.5 ), (long body :1.3), (mutation),(poorly drawn :1.2), bad anatomy, liquid body, liquid tongue, disfigured,malformed, mutated, anatomical nonsense, text font ui, error,malformed hands, long neck, blurred, bad proportions, bad shadow,uncoordinated body, unnatural body, fused breasts, bad breasts,huge breasts, poorly drawn breasts, extra breasts, liquid breasts,heavy breasts, missing breasts, huge haunch, huge thighs, huge calf,bad hands, fused hand, missing hand, disappearing arms, disappearing thigh,disappearing calf, disappearing legs, fused ears, bad ears, poorly drawn ears,extra ears, liquid ears, missing ears, missing finger, broken finger";

const gptDrawCommand = new SlashCommandBuilder()
  .setName("gpt-draw")
  .setDescription("使用ChatGPT 生成指令並讓 stable diffusion 生成圖片")
  .addStringOption((option: any) =>
    option
      .setName("prompt")
      .setDescription("輸入任何圖片說明")
      .setRequired(true)
  );

const gptDrawSubService: BotSubService<BotCommand> = (bot, command) => {
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
        try {
          const attachment = await render({
            prompt: reply,
            negative_prompt,
            steps: 40,
          });
          await interaction.editReply({
            files: [attachment],
          });
        } catch (error) {
          await interaction.editReply((`繪製出錯：` + error) as string);
        }
      }
    } catch (error) {}
  });
};

const drawCommand = new SlashCommandBuilder()
  .setName("draw")
  .setDescription("使用stable diffusion 生成圖片")
  .addStringOption((option: any) =>
    option.setName("prompt").setDescription("輸入詠唱咒文").setRequired(true)
  )
  .addStringOption((option: any) =>
    option.setName("negative_prompt").setDescription("輸入詠唱結界")
  )
  .addNumberOption((option: any) =>
    option.setName("width").setDescription("輸入圖片寬度，必須小於 2048")
  )
  .addNumberOption((option: any) =>
    option.setName("height").setDescription("輸入圖片高度，必須小於 2048")
  )
  .addNumberOption((option: any) =>
    option.setName("steps").setDescription("輸入多重詠唱次數(默認50)")
  )
  .addStringOption((option: any) =>
    option.setName("sampler_index").setDescription("輸入咒文語言(默認 Euler)")
  )
  .addNumberOption((option: any) =>
    option.setName("cfg_scale").setDescription("輸入咒能強度(默認 7)")
  )
  .addStringOption((option: any) =>
    option
      .setName("styles")
      .setDescription("styles，可以使用英文逗號','分隔不同的風格")
  );

const drawSubService: BotSubService<BotCommand> = (bot, command) => {
  bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === command.name) {
      const rawPrompt = interaction.options.getString("prompt");
      const rawNegative_prompt =
        interaction.options.getString("negative_prompt");
      const rawWidth = interaction.options.getNumber("width");
      const rawHeight = interaction.options.getNumber("height");
      const rawSteps = interaction.options.getNumber("steps");
      const rawSampler_index = interaction.options.getString("sampler_index");
      const rawCfg_scale = interaction.options.getNumber("cfg_scale");
      const rawStyles = interaction.options.getString("styles");

      if (!rawPrompt) {
        await interaction.reply("請輸入文字");
        return;
      }

      const renderProps = {
        prompt: rawPrompt,
        negative_prompt: rawNegative_prompt || "",
        width: rawWidth ? rawWidth : 512,
        height: rawHeight ? rawHeight : 512,
        steps: rawSteps ? rawSteps : 50,
        sampler_index: rawSampler_index || "Euler",
        cfg_scale: rawCfg_scale ? rawCfg_scale : 7,
        styles: rawStyles ? rawStyles.split(",") : [],
      };

      if (renderProps.width < 0 || renderProps.height < 0) {
        await interaction.reply("圖片寬度或高度不能小於0");
        return;
      }

      if (renderProps.width > 2048 || renderProps.height > 2048) {
        await interaction.reply("圖片寬度或高度不能超過2048");
        return;
      }

      if (renderProps.steps > 150) {
        await interaction.reply("圖片繪製精度不能超過150");
        return;
      }

      await interaction.reply(
        `FillCast 正在繪製: \n咒文:\`${rawPrompt}\`\n結界:\`${rawNegative_prompt}\`\n咒文語言:\`${renderProps.sampler_index}\`\n魔能強度:\`${renderProps.cfg_scale}\``
      );
      try {
        const attachment = await render(renderProps);
        await interaction.editReply({
          files: [attachment],
        });
      } catch (error) {
        await interaction.editReply((`繪製出錯：` + error) as string);
      }
    }
  });
};

const service: BotService = (bot) => {
  gptDrawSubService(bot, gptDrawCommand);
  drawSubService(bot, drawCommand);

  return [gptDrawCommand, drawCommand];
};

export default service;
