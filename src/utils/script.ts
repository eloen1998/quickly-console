export function getScriptContent(code: string) {
  const scriptRegex = /(<script\b[^>]*>)([\s\S]*?)<\/script>/gi;

  let scriptContentList = [];

  let scriptContent;

  while ((scriptContent = scriptRegex.exec(code))) {
    let source = scriptContent[2];
    let start = scriptContent[1].length + scriptContent.index;
    let end = start + source.length;
    scriptContentList.push({
      start,
      end,
      source
    });
  }
  return scriptContentList;
}
