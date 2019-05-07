'use strict';

import {
    DocumentLinkProvider as vsDocumentLinkProvider,
    TextDocument,
    ProviderResult,
    DocumentLink,
    workspace,
    Position,
    Range,
} from "vscode"
import * as util from '../util';

export class LinkProvider implements vsDocumentLinkProvider {
    public provideDocumentLinks(doc: TextDocument): ProviderResult<DocumentLink[]> {
        let documentLinks = [];
        let config = workspace.getConfiguration('laravel_goto_view');
        let index = 0;
        let reg = /(?<=view\(|@include\(|@extends\(|@component\()(['"])[^'"]*\1/g;
        if (config.quickJump) {
            while (index < doc.lineCount) {
                let line = doc.lineAt(index);
                let result = line.text.match(reg);
                if (result != null) {
                    for (let item of result) {
                        let file = util.getFilePath(item, doc);
                        if (file != null) {
                            let start = new Position(line.lineNumber, line.text.indexOf(item));
                            let end = start.translate(0, item.length);
                            let documentlink = new DocumentLink(new Range(start, end), file.fileUri);
                            documentLinks.push(documentlink);
                        };
                    }
                }
                index++;
            }
        }
        return documentLinks;
    }
}
