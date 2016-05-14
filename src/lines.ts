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

    static async RemoveUnmarked() {
        var doc = vscode.window.activeTextEditor.document;

        if(!Lines.markMap[doc.fileName] || Lines.markMap[doc.fileName].length == 0) {
            return;
        }

        await Lines.RemoveOnCondition(text => {
            for (var index = 0; index < Lines.markMap[doc.fileName].length; index++) {
                var pattern = Lines.markMap[doc.fileName][index];

                if(text.indexOf(pattern) >= 0) {
                    return false;
                }
            }

            return true;
        });

        Lines.markMap[doc.fileName] = new Array<string>();

        Lines.ApplyMarks(doc);
    }

    private static async RemoveOnCondition(condition: (lineText: string) => boolean): Promise<boolean> {
        var doc = vscode.window.activeTextEditor.document;

        var rangesToDelete = new Array<vscode.Range>();

        var rangeStart: vscode.Position = null;

        for(var currentLine = 0; currentLine < doc.lineCount; currentLine++) {
            if(condition(doc.lineAt(currentLine).text)) {
                if(rangeStart == null)
                {
                    rangeStart = new vscode.Position(currentLine, 0);
                }
            }
            else if(rangeStart != null)
            {
                rangesToDelete.push(new vscode.Range(rangeStart, new vscode.Position(currentLine, 0)));

                rangeStart = null;
            }
        }

        if(rangeStart != null)
        {
            var end = new vscode.Position(doc.lineCount, doc.lineAt(doc.lineCount - 1).text.length);

            rangesToDelete.push(new vscode.Range(rangeStart, end));
        }

        var result = await vscode.window.activeTextEditor.edit(builder => {
            rangesToDelete.forEach(range => builder.delete(range));
        });

        return result;
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

