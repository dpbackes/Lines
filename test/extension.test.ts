//
// Note: This test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert';

import * as vscode from 'vscode';
import { Lines } from '../src/lines';

suite("Extension Tests", () => {
    teardown(() => {
        const start    = new vscode.Position(0, 0);
        const lastLine = vscode.window.activeTextEditor.document.lineCount - 1;
        const end      = vscode.window.activeTextEditor.document.lineAt(lastLine).range.end;
        const range    = new vscode.Range(start, end);

        return vscode.window.activeTextEditor.edit(editBuilder => {
            editBuilder.delete(range);
        });
    });

    test("remove lines", async () => {
        await Insert("remove\n");
        await Insert("keep\n");
        await Insert("keep\n");
        await Insert("remove\n");
        await Insert("remove\n");
        await Insert("keep\n");
        await Insert("remove\n");

        await Lines.Remove("remove");
        assertEqualLines(["keep", "keep", "keep", ""]);
    });

    test("remove lines inverse", async () => {
        await Insert("remove\n");
        await Insert("keep\n");
        await Insert("keep\n");
        await Insert("remove\n");
        await Insert("remove\n");
        await Insert("keep\n");
        await Insert("remove\n");

        await Lines.RemoveInverse("keep");
        assertEqualLines(["keep", "keep", "keep"]);
    });

    test("remove marked lines", async () => {
        Lines.MarkDecorationType = vscode.window.createTextEditorDecorationType({
            overviewRulerLane: vscode.OverviewRulerLane.Full,
        });
        
        await Insert("remove\n");
        await Insert("keep\n");
        await Insert("keep\n");
        await Insert("remove\n");
        await Insert("remove\n");
        await Insert("keep\n");
        await Insert("remove\n");

        await Lines.Mark("remove");
        await Lines.RemoveMarked();

        assertEqualLines(["keep", "keep", "keep", ""]);
    });
});

async function Insert(text: string): Promise<boolean> {
    return vscode.window.activeTextEditor.edit(builder => {
        builder.insert(vscode.window.activeTextEditor.selection.active, text);
    })
}

function assertEqualLines(expectedLines: string[]) {
    assert.equal(vscode.window.activeTextEditor.document.lineCount, expectedLines.length);

    for (let i = 0; i < expectedLines.length; i++) {
        var expected = expectedLines[i];
        var actual = vscode.window.activeTextEditor.document.lineAt(i).text;
        assert.equal(actual, expected);
    }
}