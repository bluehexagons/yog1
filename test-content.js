'use strict';

const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const core = require('./game-core.js');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('game-content.js', 'utf8'), context, {
    filename: 'game-content.js'
});
function number(value, id, solution) {
    return { type: 'number', value: value, id: id, solution: !!solution };
}
function binary(operation, left, right) {
    return { type: 'binary', operation: operation, left: left, right: right };
}
function squareRoot(value) {
    return { type: 'root', value: value };
}
const content = context.window.Yog1Content({
    number: number, binary: binary, squareRoot: squareRoot
});

assert.strictEqual(content.curated.length, 10, 'the handcrafted set contains ten puzzles');
for (const [index, item] of content.curated.entries()) {
    const analysis = core.analyzeProblem(item.sides);
    assert.strictEqual(analysis.unique, true,
        'handcrafted puzzle ' + (index + 1) + ' has exactly one solution');
    assert.strictEqual(analysis.safe, true,
        'handcrafted puzzle ' + (index + 1) + ' keeps every flip safe');
    const details = core.solutionDetails(item.sides, {});
    assert.strictEqual(details.solutionId, analysis.solutions[0].id,
        'handcrafted puzzle ' + (index + 1) + ' marks its unique solution');
}
assert.strictEqual(new Set(content.achievements.map(function (item) {
    return item.id;
})).size, content.achievements.length, 'achievement IDs are unique');

console.log('Game content tests passed.');
