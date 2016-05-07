//
// Note: This test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert';

import * as vscode from 'vscode';
import { Lines } from '../src/lines';

suite("Extension Tests", () => {
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
        assert.equal(expected, actual);
    }
}