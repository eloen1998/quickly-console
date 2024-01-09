import { getScriptContent } from "../utils/script";
import { getVariableJs, getConsoleRangeJs } from "./handleJs";
export function getVariableOther(code: string, index: number) {
  const scriptContentList = getScriptContent(code);

  const scriptContent = scriptContentList.find((scriptContent) => scriptContent.start <= index && scriptContent.end >= index);
  if (!scriptContent) {
    return {};
  }
  return getVariableJs(scriptContent.source, index - scriptContent.start);
}

export function getConsoleRangeOther(code: string) {
  const scriptContentList = getScriptContent(code);

  return scriptContentList.reduce((pre: ConsoleRange[], scriptContent) => {
    return [...pre, ...getConsoleRangeJs(scriptContent.source, scriptContent.start)];
  }, [] as ConsoleRange[]);
}
