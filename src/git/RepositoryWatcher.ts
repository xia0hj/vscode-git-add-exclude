import { filterByCommentTag } from "@src/regex/filter";
import { type Repository } from "@src/git/git_extension_api";
import * as vscode from "vscode";

export interface RepositoryInternalApi extends Repository {
  repository: {
    onDidRunOperation: (
      callback: (param: { operation: { kind: string } }) => void
    ) => vscode.Disposable;
    stage: (uri: vscode.Uri, stageText: string) => void;
  };
}

export class RepositoryWatcher implements vscode.Disposable {
  repository: RepositoryInternalApi;

  disposable?: vscode.Disposable;

  constructor(repository: Repository) {
    this.repository = repository as RepositoryInternalApi;

    if (
      this.repository.repository == null ||
      this.repository.repository.onDidRunOperation == null ||
      this.repository.repository.stage == null
    ) {
      throw new Error(
        "Can not read extension vscode.git repository internal api !!!"
      );
    }
  }

  watchOperationAdd() {
    this.disposable = this.repository.repository.onDidRunOperation(
      ({ operation }) => {
        if (operation.kind !== "Add") {
          return;
        }
        const config = getExtensionConfig();
        this.repository.state.indexChanges.forEach(async ({ uri }) => {
          const textDocument = await vscode.workspace.openTextDocument(uri);
          const textSplitedByLine: string[] = [];
          for (let line = 0; line < textDocument.lineCount; line++) {
            textSplitedByLine.push(textDocument.lineAt(line).text);
          }
          const stageText = filterByCommentTag({
            languageId: textDocument.languageId,
            textSplitedByLine,
            startTag: config.blockStartTag,
            endTag: config.blockEndTag,
          });
          this.repository.repository.stage(uri, stageText.join(""));
        });
      }
    );
  }

  dispose() {
    this.disposable?.dispose();
  }
}

function getExtensionConfig() {
  const configGetter = vscode.workspace.getConfiguration("git-add-exclude");

  const blockStartTag = configGetter.get<string>(
    "blockStartTag",
    "#git-add-exclude-start"
  );
  const blockEndTag = configGetter.get<string>(
    "blockEndTag",
    "#git-add-exclude-end"
  );

  const extensionConfig = {
    blockStartTag,
    blockEndTag,
  };

  console.log("read config", extensionConfig);

  return extensionConfig;
}
