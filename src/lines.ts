import * as vscode from 'vscode';

export class Lines {
    static set MarkDecorationType(value : vscode.TextEditorDecorationType) {
        Lines.markDecorationType = value;
    }

    private static markDecorationType : vscode.TextEditorDecorationType;
    private static markMap : { [documentName: string] : Array<string> } = {};

    static async Remove(pattern: string): Promise<boolean> {
        return Lines.RemoveOnCondition(text => {
            return text.indexOf(pattern) >= 0;
        })
    }

    static async RemoveInverse(pattern: string): Promise<boolean> {
        return Lines.RemoveOnCondition(text => {
            return text.indexOf(pattern) < 0;
        })
    }

    static Mark(pattern: string) {
        var doc = vscode.window.activeTextEditor.document;

        if(!Lines.markMap[doc.fileName]) {
            Lines.markMap[doc.fileName] = new Array<string>();
        }

        if(Lines.markMap[doc.fileName].indexOf(pattern) < 0) {
            Lines.markMap[doc.fileName].push(pattern);
        }

        Lines.ApplyMarks(doc);
    }

    static ClearMarks() {
        var doc = vscode.window.activeTextEditor.document;

        if(!Lines.markMap[doc.fileName]) {
            return;
        }

        Lines.markMap[doc.fileName] = new Array<string>();

        Lines.ApplyMarks(doc);
    }

    static async RemoveMarked() {
        var doc = vscode.window.activeTextEditor.document;

        if(!Lines.markMap[doc.fileName] || Lines.markMap[doc.fileName].length == 0) {
            return;
        }

        await Lines.RemoveOnCondition(text => {
            for (var index = 0; index < Lines.markMap[doc.fileName].length; index++) {
                var pattern = Lines.markMap[doc.fileName][index];

                if(text.indexOf(pattern) >= 0) {
                    return true;
                }
            }

            return false;
        });

        Lines.markMap[doc.fileName] = new Array<string>();

        Lines.ApplyMarks(doc);
    }

    private static async RemoveOnCondition(condition: (lineText: string) => boolean): Promise<boolean> {
        return vscode.window.activeTextEditor.edit(builder => {
            var doc = vscode.window.activeTextEditor.document;

            for(var i = 0; i < doc.lineCount; i++) {
                if(condition(doc.lineAt(i).text)) {
                    if(i > 0) {
                        builder.delete(new vscode.Range(i - 1, doc.lineAt(i - 1).text.length, i , doc.lineAt(i).text.length));
                        continue;
                    }

                    builder.delete(new vscode.Range(i, 0, i + 1, 0));
                }
            }
        });
    }

    private static ApplyMarks(doc : vscode.TextDocument) {
        var marks = new Array<vscode.Range>();

        Lines.markMap[doc.fileName].forEach(pattern => {
            for(var i = 0; i < doc.lineCount; i++) {
                if(doc.lineAt(i).text.indexOf(pattern) >= 0) {
                    marks.push(new vscode.Range(i, 0, i, doc.lineAt(i).text.length));
                }
            }
        });

        vscode.window.activeTextEditor.setDecorations(Lines.markDecorationType, marks);
    }
}

