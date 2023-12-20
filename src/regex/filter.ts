import { languageCommentMap } from "@src/regex/matcher";

type FilterParameter = {
  languageId: string;
  textSplitedByLine: string[];
  startTag: string;
  endTag: string;
};

/**
 * @todo
 */
export function filterByCommentTag({
  textSplitedByLine,
  languageId,
  startTag,
  endTag,
}: FilterParameter) {
  const targetCommentRegex =
    languageCommentMap[languageId] ?? languageCommentMap.default;

  /**
   * @key comment type
   * @value start line
   */
  const commentStartLineMap = new Map<string, number[]>();

  /**
   * matchedStartEnd[n][0] is matched comment start line
   * matchedStartEnd[n][1] is matched comment end line
   */
  const matchedStartEnd: number[][] = [];

  textSplitedByLine.forEach((lineText, lineNumber) => {
    for (const commentRegex of targetCommentRegex) {
      if (commentRegex.buildRegex(startTag).test(lineText)) {
        const startLineStack = commentStartLineMap.get(commentRegex.type) ?? [];
        startLineStack.push(lineNumber);
        commentStartLineMap.set(commentRegex.type, startLineStack);
      } else if (commentRegex.buildRegex(endTag).test(lineText)) {
        const startLineStack = commentStartLineMap.get(commentRegex.type);
        const matchedStartLine = startLineStack?.pop();
        if (matchedStartLine != null) {
          matchedStartEnd.push([matchedStartLine, lineNumber]);
        }
      }
    }
  });

  if (matchedStartEnd.length === 0) {
    return textSplitedByLine;
  }

  const mergedStartEnd: number[][] = [matchedStartEnd[0]];
  matchedStartEnd.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  for (let i = 1; i < matchedStartEnd.length; i++) {
    const lastRange = mergedStartEnd[mergedStartEnd.length - 1];
    const curRange = matchedStartEnd[i];
    if (curRange[0] <= lastRange[1]) {
      lastRange[1] = curRange[1];
    } else {
      mergedStartEnd.push(curRange);
    }
  }

  const result: string[] = [];
  for (let i = 0; i < mergedStartEnd.length; i++) {
    const lastEndLine = i === 0 ? 0 : mergedStartEnd[i - 1][1];
    const curStartLine = mergedStartEnd[i][0];
    if (lastEndLine + 1 < curStartLine) {
      result.concat(textSplitedByLine.slice(lastEndLine + 1, curStartLine));
    }
  }

  const lastEndLine = mergedStartEnd[mergedStartEnd.length - 1][1];
  if (lastEndLine + 1 < textSplitedByLine.length) {
    result.concat(
      textSplitedByLine.slice(lastEndLine + 1, textSplitedByLine.length)
    );
  }

  return result;
}
