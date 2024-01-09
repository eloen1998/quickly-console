import { getVariableJs, getConsoleRangeJs } from "./handleJs";
import { getVariableOther, getConsoleRangeOther } from "./handleOther";

export function getVariable(code: string, index: number, type: string) {
  if (isJsOrTs(type)) {
    return getVariableJs(code, index);
  } else {
    return getVariableOther(code, index);
  }
}

export function getConsoleRange(code: string, type: string) {
  if (isJsOrTs(type)) {
    return getConsoleRangeJs(code);
  } else {
    return getConsoleRangeOther(code);
  }
}

function isJsOrTs(type: string) {
  return ["javascript", "typescript"].includes(type);
}
