'use strict';

const assert = require('assert');
const core = require('./game-core.js');

function seededRandom(seed) {
    return function () {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
    };
}

for (const profile of Object.values(core.DIFFICULTIES)) {
    for (let round = 1; round <= 40; round++) {
        const problem = core.generateProblem({
            profile: profile,
            round: round,
            random: seededRandom(round * 91 + profile.target)
        });
        const values = {};
        let solutionId = null;
        core.visitNumbers(problem.sides[0], inspect);
        core.visitNumbers(problem.sides[1], inspect);

        function inspect(node) {
            if (node.solution) {
                solutionId = node.id;
                values[node.id] = 1;
            }
        }

        assert(solutionId, profile.name + ' round ' + round + ' has a solution');
        assert.notStrictEqual(
            core.evaluate(problem.sides[0]),
            core.evaluate(problem.sides[1]),
            profile.name + ' begins unsolved'
        );
        assert.strictEqual(
            core.evaluate(problem.sides[0], values),
            core.evaluate(problem.sides[1], values),
            profile.name + ' is solved by one flip'
        );
        assert(Number.isInteger(core.evaluate(problem.sides[0], values)));
        assert(Number.isInteger(core.evaluate(problem.sides[1], values)));
        const signature = core.OPERATIONS[profile.operations[profile.operations.length - 1]].symbol;
        assert(
            problem.sides.map(core.serialize).join(' = ').includes(signature),
            profile.name + ' includes its signature operation ' + signature
        );
    }
}

const average = core.ROUND_WAVE.reduce((sum, value) => sum + value, 0) / core.ROUND_WAVE.length;
assert.strictEqual(average, 1);
assert.strictEqual(core.roundTarget(20, 1).kind, 'Warm-up');
assert.strictEqual(core.roundTarget(20, 5).kind, 'Challenge');

const allOperations = new Set();
for (let seed = 1; seed <= 100; seed++) {
    const problem = core.generateProblem({
        profile: core.DIFFICULTIES.master,
        round: seed,
        random: seededRandom(seed)
    });
    const text = problem.sides.map(core.serialize).join(' = ');
    for (const operation of Object.values(core.OPERATIONS)) {
        if (text.includes(operation.symbol)) {
            allOperations.add(operation.symbol);
        }
    }
}
for (const operation of Object.values(core.OPERATIONS)) {
    assert(allOperations.has(operation.symbol), 'generated ' + operation.label);
}

console.log('Core tests passed for 200 standard puzzles and all operation types.');
