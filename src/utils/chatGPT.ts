import { Configuration, OpenAIApi } from "openai";
import illegalWordFilter from "./illegalWordFilter";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export interface Message {
  role: "system" | "assistant" | "user";
  content: string;
}
const userHistory = new Map<string, Message[]>();

// 新增歷史紀錄，歷史紀錄不會超過6次
function addHistory(
  role: "system" | "assistant" | "user",
  userId: string,
  message: string
) {
  const messages = userHistory.get(userId) || [];
  messages.push({
    role,
    content: message,
  });
  if (messages.length > parseInt(process.env.CHATGPT_MAX_TALK_LEN as string)) {
    messages.shift();
  }
  userHistory.set(userId, messages);
}

export function resetHistory(userId: string) {
  userHistory.delete(userId);
}

interface ChatWithGPT {
  prompt: string;
  userId: string;
  withHistory: Boolean;
  systemMessage?: Message;
}
async function chatWithGPT({
  prompt,
  userId,
  withHistory,
  systemMessage,
}: ChatWithGPT) {
  if (!prompt) throw new Error("No input");

  let messages: Message[] = [];
  if (withHistory) {
    addHistory("user", userId, prompt);
    messages = [...(userHistory.get(userId) as Message[])];
  } else {
    messages.push({
      role: "user",
      content: prompt,
    });
  }

  if (systemMessage) {
    messages.unshift(systemMessage);
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });

  const content = completion.data.choices[0].message?.content;
  if (!content) return "No content";

  addHistory("assistant", userId, content);

  return illegalWordFilter(content);
}

export default chatWithGPT;
