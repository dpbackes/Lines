import * as vscode from 'vscode';

export class Lines {
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
    
    private static async RemoveOnCondition(condition: (lineText: string) => boolean): Promise<boolean> {
        return vscode.window.activeTextEditor.edit(builder => {
            var doc = vscode.window.activeTextEditor.document;

            for(var i = 0; i < doc.lineCount; i++)
            {
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
}

