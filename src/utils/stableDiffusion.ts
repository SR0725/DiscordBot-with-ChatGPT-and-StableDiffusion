import { AttachmentBuilder } from "discord.js";
import axios from "axios";

export async function render(prompt: string) {
  const request = await axios.post("http://127.0.0.1:7860/sdapi/v1/txt2img", {
    prompt,
  });

  const image = await request.data.images[0];

  const imageStream = new Buffer(image, "base64");
  const attachment = new AttachmentBuilder(imageStream, {
    name: "image.png",
  });

  return attachment;
}
