import * as vscode from 'vscode';

export class Lines {
    static async Remove(pattern: string): Promise<boolean> {
        return vscode.window.activeTextEditor.edit(builder => {
            var doc = vscode.window.activeTextEditor.document;
            
            for(var i = 0; i < doc.lineCount; i++)
            {
                if(doc.lineAt(i).text.indexOf(pattern) >= 0) {
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

