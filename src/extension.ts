/// <reference path="./lines.ts"/>

import * as vscode from 'vscode';
import * as Lines from './lines';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.linesRemove', variable => {
        vscode.window.showInputBox({prompt : "Enter search string. Matching lines will be removed."})
            .then(pattern => {
                Lines.Lines.Remove(pattern);
            });
        });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}