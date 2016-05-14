/// <reference path="./lines.ts"/>

import * as vscode from 'vscode';
import { Lines }  from './lines';

export function activate(context: vscode.ExtensionContext) {
    var markbookmarkDecorationType = vscode.window.createTextEditorDecorationType({
        gutterIconPath: context.asAbsolutePath("images\\mark.png"),
        overviewRulerLane: vscode.OverviewRulerLane.Full,
    });

    Lines.MarkDecorationType = markbookmarkDecorationType;

    let linesRemove = vscode.commands.registerCommand('extension.linesRemove', variable => {
        vscode.window.showInputBox({prompt : "Enter search string. Matching lines will be removed."})
            .then(pattern => {
                Lines.Remove(pattern);
            });
        });

    context.subscriptions.push(linesRemove);

    let linesRemoveInverse = vscode.commands.registerCommand('extension.linesRemoveInverse', variable => {
        vscode.window.showInputBox({prompt : "Enter search string. Non-matching lines will be removed."})
            .then(pattern => {
                Lines.RemoveInverse(pattern);
            });
        });

    context.subscriptions.push(linesRemoveInverse);

    let linesMark = vscode.commands.registerCommand('extension.linesMark', variable => {
        vscode.window.showInputBox({prompt : "Enter search string. Matching lines will be marked."})
            .then(pattern => {
                Lines.Mark(pattern);
            });
        });

    context.subscriptions.push(linesMark);

    let linesClearMarks = vscode.commands.registerCommand('extension.linesClearMarks', variable => {
            Lines.ClearMarks();
        });

    context.subscriptions.push(linesClearMarks);

    let linesRemoveMarked = vscode.commands.registerCommand('extension.linesRemoveMarked', variable => {
            Lines.RemoveMarked();
        });

    context.subscriptions.push(linesRemoveMarked);

    let linesRemoveUnmarked = vscode.commands.registerCommand('extension.linesRemoveUnmarked', variable => {
            Lines.RemoveUnmarked();
        });

    context.subscriptions.push(linesRemoveUnmarked);
}

export function deactivate() {
}