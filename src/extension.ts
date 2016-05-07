/// <reference path="./lines.ts"/>

import * as vscode from 'vscode';
import * as Lines from './lines';

export function activate(context: vscode.ExtensionContext) {
    let linesRemove = vscode.commands.registerCommand('extension.linesRemove', variable => {
        vscode.window.showInputBox({prompt : "Enter search string. Matching lines will be removed."})
            .then(pattern => {
                Lines.Lines.Remove(pattern);
            });
        });

    context.subscriptions.push(linesRemove);

    let linesRemoveInverse = vscode.commands.registerCommand('extension.linesRemoveInverse', variable => {
        vscode.window.showInputBox({prompt : "Enter search string. Non-matching lines will be removed."})
            .then(pattern => {
                Lines.Lines.RemoveInverse(pattern);
            });
        });

    context.subscriptions.push(linesRemoveInverse);
}

export function deactivate() {
}