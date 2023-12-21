import { expect, test } from "vitest";

type CommentRegex = {
  buildRegex: (tag: string) => RegExp;
  type: string;
};

const CommentDoubleSlash: CommentRegex = {
  buildRegex: (tag: string) =>
    RegExp(`^[\\*\\s]*((\\/\\/)|(\\/\\*))[\\*\\s]*${tag}`),
  type: "doubleSlash",
} as const;

const CommentNumberSign: CommentRegex = {
  buildRegex: (tag) => RegExp(`^[\\*\\s]*#[\\*\\s]*${tag}`),
  type: "numberSign",
} as const;

const CommentHtmlElement: CommentRegex = {
  buildRegex: (tag) => RegExp(`^[\\*\\s]*<\!--[\\*\\s]*${tag}[\\*\\s]*-->`),
  type: "htmlElement",
} as const;

/**
 * vscode languageId
 * https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers
 */
export const languageCommentMap: { [languageId: string]: CommentRegex[] } = {
  java: [CommentDoubleSlash],
  javascript: [CommentDoubleSlash],
  javascriptreact: [CommentDoubleSlash, CommentHtmlElement],
  typescript: [CommentDoubleSlash],
  typescriptreact: [CommentDoubleSlash, CommentHtmlElement],

  default: [CommentDoubleSlash],
} as const;

if (import.meta.vitest) {
  const tag = "@git-add-exclude-start";
  test("Test comment //", () => {
    const douhleSlashRegex = CommentDoubleSlash.buildRegex(tag);
    expect(douhleSlashRegex.test(`//${tag}`)).toBe(true);
    expect(douhleSlashRegex.test(`  //   ${tag}  `)).toBe(true);
  });
  test("Test comment #", () => {
    const numberSignRegex = CommentNumberSign.buildRegex(tag);
    expect(numberSignRegex.test(`#${tag}`)).toBe(true);
    expect(numberSignRegex.test(`    #    ${tag}   `)).toBe(true);
  });
  test("Test comment <!-- -->", () => {
    const htmlElementRegex= CommentHtmlElement.buildRegex(tag)
    expect(htmlElementRegex.test(`<!--${tag}-->`)).toBe(true)
    expect(htmlElementRegex.test(`     <!--    ${tag}  -->`)).toBe(true)
  })
}
