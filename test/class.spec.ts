import { describe, it, expect } from "vitest";
import { getVariableJs } from "../src/handler/handleJs";
describe("声明语句变量识别", async () => {
  it("class方法声明", () => {
    const code = `class Test {
        fun() {

        }
    }`;
    const name = getVariableJs(code, 28);
    expect(name).toEqual({ funcName: "fun", variables: [] });
  });
  it("class方法声明（带参）", () => {
    const code = `class Test {
        fun(aa: number) {

        }
    }`;
    const name = getVariableJs(code, 38);
    expect(name).toEqual({ funcName: "fun", variables: ['aa'] });
  });
});
