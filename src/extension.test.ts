import { describe, expect, it, vi } from "vitest";

vi.mock("vscode", () => {
  return {
    window: vi.fn(),
    workspace: vi.fn(),
  };
});

describe("should", () => {
  it("exported", () => {
    expect(1).toEqual(1);
  });
});
