import { expect, test } from "vitest";

type CommentRegex = {
  buildRegex: (tag: string) => RegExp;
  type: string;
};

const doubleSlash: CommentRegex = {
  buildRegex: (tag: string) =>
    RegExp(`^[\\*\\s]*((\\/\\/)|(\\/\\*))[\\*\\s]*${tag}`),
  type: "doubleSlash",
};

const numberSign: CommentRegex = {
  buildRegex: (tag) => RegExp(`^[\\*\\s]*#[\\*\\s]*${tag}`),
  type: "numberSign",
};

const htmlElement: CommentRegex = {
  buildRegex: (tag) => RegExp(`^[\\*\\s]*<--[\\*\\s]*${tag}[\\*\\s]*-->`),
  type: "htmlElement",
};

/**
 * vscode languageId
 * https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers
 */
export const languageCommentMap: { [languageId: string]: CommentRegex[] } = {
  java: [doubleSlash],
  javascript: [doubleSlash],
  javascriptreact: [doubleSlash, htmlElement],
  typescript: [doubleSlash],
  typescriptreact: [doubleSlash, htmlElement],

  default: [doubleSlash],
} as const;


if (import.meta.vitest) {
  test("Test regex", () => {
    const tag = "#git-add-exclude-start";
    expect(
      doubleSlash.buildRegex(tag).test("  //   #git-add-exclude-start  ")
    ).toBe(true);
  });
}
