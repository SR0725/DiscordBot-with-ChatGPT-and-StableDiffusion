import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export interface Message {
  role: "system" | "assistant" | "user";
  content: string;
}
const userHistory = new Map<string, Message[]>();
function addHistory(
  role: "system" | "assistant" | "user",
  userId: string,
  message: string
) {
  if (!userHistory.has(userId)) {
    userHistory.set(userId, []);
  }

  const history = userHistory.get(userId) as Message[];
  history.push({
    role,
    content: message,
  });

  userHistory.set(userId, history);
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

  return content;
}

export default chatWithGPT;
