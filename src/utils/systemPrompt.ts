import fs from "fs";
import path from "path";

const PROMPT_FILE_PATH = path.resolve("./src/data/prompt.txt");

const getPrompt = (): string => fs.readFileSync(PROMPT_FILE_PATH, "utf8");
const setPrompt = (prompt: string): void =>
  fs.writeFileSync(PROMPT_FILE_PATH, prompt);

const useSystemPrompt = (): {
  getPrompt: () => string;
  setPrompt: (prompt: string) => void;
} => {
  return {
    getPrompt,
    setPrompt,
  };
};

export default useSystemPrompt;
