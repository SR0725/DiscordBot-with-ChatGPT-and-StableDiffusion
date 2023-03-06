import { AttachmentBuilder } from "discord.js";
import axios from "axios";

interface RenderProps {
  prompt: string;
  width?: number;
  height?: number;
  steps?: number;
  sampler_index?: string;
  cfg_scale?: number;
  styles?: string[];
}
export async function render({
  prompt,
  width,
  height,
  steps,
  sampler_index,
  cfg_scale,
  styles,
}: RenderProps) {
  const request = await axios.post("http://127.0.0.1:7860/sdapi/v1/txt2img", {
    prompt,
    width: width || 512,
    height: height || 512,
    steps: steps || 50,
    sampler_index: sampler_index || "Euler",
    cfg_scale: cfg_scale || 7,
    styles: styles || [],
  });

  const image = await request.data.images[0];

  const imageStream = new Buffer(image, "base64");
  const attachment = new AttachmentBuilder(imageStream, {
    name: "image.png",
  });

  return attachment;
}
