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
        const analysis = core.analyzeProblem(problem.sides);
        assert.strictEqual(analysis.unique, true,
            profile.name + ' round ' + round + ' has exactly one valid flip');
        assert.strictEqual(analysis.safe, true,
            profile.name + ' round ' + round + ' keeps every player flip safe');
        assert.strictEqual(problem.analysis.solutionCount, 1,
            'generated analysis is attached to the problem');
        assert(Math.abs(problem.score - problem.target) <= Math.max(12, problem.target * 0.7),
            profile.name + ' round ' + round + ' is reasonably close to its target score');
        assert(Number.isInteger(core.evaluate(problem.sides[0], values)));
        assert(Number.isInteger(core.evaluate(problem.sides[1], values)));
        const allNumbers = [];
        core.visitNumbers(problem.sides[0], function (node) { allNumbers.push(node); });
        core.visitNumbers(problem.sides[1], function (node) { allNumbers.push(node); });
        for (const node of allNumbers) {
            assert(node.value > 0, profile.name + ' keeps standard puzzle literals positive');
            const trial = {};
            trial[node.id] = 1;
            assert(Number.isInteger(core.evaluate(problem.sides[0], trial)));
            assert(Number.isInteger(core.evaluate(problem.sides[1], trial)));
        }
        const signature = core.OPERATIONS[profile.operations[profile.operations.length - 1]].symbol;
        assert(
            problem.sides.map(core.serialize).join(' = ').includes(signature),
            profile.name + ' includes its signature operation ' + signature
        );
    }
}

function numberCount(problem) {
    let count = 0;
    problem.sides.forEach(function (side) {
        core.visitNumbers(side, function () { count++; });
    });
    return count;
}

for (let seed = 1; seed <= 40; seed++) {
    const easy = core.generateProblem({
        profile: core.DIFFICULTIES.easy,
        round: seed,
        random: seededRandom(seed)
    });
    assert.strictEqual(numberCount(easy), 3, 'easy problems have exactly three selectable values');
}
for (const profile of [core.DIFFICULTIES.normal, core.DIFFICULTIES.hard, core.DIFFICULTIES.expert]) {
    let shortRounds = 0;
    for (let seed = 1; seed <= 100; seed++) {
        const problem = core.generateProblem({
            profile: profile,
            round: seed,
            random: seededRandom(seed * 17 + profile.target)
        });
        if (numberCount(problem) === 3) shortRounds++;
    }
    assert(shortRounds > 10, profile.name + ' retains a meaningful number of three-value rounds');
}

const average = core.ROUND_WAVE.reduce((sum, value) => sum + value, 0) / core.ROUND_WAVE.length;
assert.strictEqual(average, 1);
for (let sessionLength = 20; sessionLength <= 40; sessionLength++) {
    const sessionAverage = Array.from({ length: sessionLength }, function (_, index) {
        return core.ROUND_WAVE[index % core.ROUND_WAVE.length];
    }).reduce(function (sum, value) {
        return sum + value;
    }, 0) / sessionLength;
    assert(
        Math.abs(sessionAverage - 1) <= 0.04,
        sessionLength + '-round sessions stay close to the selected average difficulty'
    );
}
assert.strictEqual(core.roundTarget(20, 1).kind, 'warmup');
assert.strictEqual(core.roundTarget(20, 5).kind, 'challenge');

for (const operation of Object.keys(core.OPERATIONS)) {
    const customOperations = operation === 'root'
        ? ['root', 'add']
        : (operation === 'modulo' ? ['modulo', 'subtract'] : [operation]);
    const custom = core.generateProblem({
        profile: core.DIFFICULTIES.easy,
        operations: customOperations,
        length: 5,
        targetRange: [10, 30],
        round: 5,
        random: seededRandom(operation.length * 101)
    });
    const customText = custom.sides.map(core.serialize).join(' = ');
    assert(customText.includes(core.OPERATIONS[operation].symbol), 'custom mode includes ' + operation);
    assert.strictEqual(custom.target, 30, 'challenge round reaches custom maximum target');
}
const customWarmup = core.generateProblem({
    profile: core.DIFFICULTIES.easy,
    operations: ['add'],
    length: 5,
    targetRange: [10, 30],
    round: 1,
    random: seededRandom(7)
});
assert.strictEqual(customWarmup.target, 10, 'warm-up round reaches custom minimum target');
assert.throws(function () {
    core.generateProblem({
        profile: core.DIFFICULTIES.easy,
        operations: ['root', 'modulo'],
        random: seededRandom(1)
    });
}, /one-flip identity/, 'custom operation sets cannot silently add an unselected identity operation');

for (const operations of [
    ['add'],
    ['subtract'],
    ['multiply'],
    ['divide'],
    ['power'],
    ['modulo', 'subtract'],
    ['root', 'add']
]) {
    for (let seed = 1; seed <= 20; seed++) {
        const custom = core.generateProblem({
            profile: core.DIFFICULTIES.extreme,
            operations: operations,
            length: 8,
            round: seed,
            random: seededRandom(seed * 313)
        });
        const used = core.solutionDetails(custom.sides, {}).operations;
        assert(
            used.every(function (operation) { return operations.includes(operation); }),
            'custom problem only uses selected operations: ' + operations.join(', ')
        );
        const nodes = [];
        custom.sides.forEach(function (side) {
            core.visitNumbers(side, function (node) { nodes.push(node); });
        });
        for (const node of nodes) {
            const values = { [node.id]: 1 };
            custom.sides.forEach(function (side) {
                assert(Number.isSafeInteger(core.evaluate(side, values)));
            });
        }
    }
}

const seededA = core.generateProblem({
    profile: core.DIFFICULTIES.hard,
    round: 7,
    random: core.createSeededRandom('share-me')
});
const seededB = core.generateProblem({
    profile: core.DIFFICULTIES.hard,
    round: 7,
    random: core.createSeededRandom('share-me')
});
assert.deepStrictEqual(seededA, seededB, 'the same seed reproduces a puzzle');
const details = core.solutionDetails(seededA.sides, {});
assert(details.solutionId, 'solution details identify the intended flip');
assert.strictEqual(details.solvedTotals[0], details.solvedTotals[1]);
assert(details.solvedSteps.some(function (side) { return side.length > 0; }),
    'solution details include step-by-step arithmetic');
assert(core.describe(seededA.sides[0], {}, { add: 'plus' }).length > 0,
    'expressions have a natural-language description');
const learning = core.learningAnalysis(seededA.sides, details.solutionId);
assert(Object.prototype.hasOwnProperty.call(core.LEARNING_CONCEPTS, learning.concept),
    'puzzles resolve to a stable learning concept');
assert.strictEqual(learning.intendedEffect.balanced, true,
    'learning analysis explains the balancing move');
assert.strictEqual(
    learning.intendedEffect.after - learning.intendedEffect.before,
    learning.intendedEffect.delta,
    'move analysis reports its numerical effect'
);
const learningExample = core.learningExample(seededA.sides);
assert.strictEqual(learningExample.solution.effect.balanced, true,
    'structured learning examples contain a verified solution effect');
assert.strictEqual(learningExample.solution.steps.length, 2,
    'structured learning examples contain both sides of the reasoning trace');

let learningState = core.normalizeLearningState(null);
assert.strictEqual(core.recommendedConcept(learningState), 'balance',
    'new learners begin with balancing addition and subtraction');
learningState = core.updateLearningState(learningState, 'balance', {
    solved: true, hints: 0, attempts: 1, durationMs: 2500
});
assert.strictEqual(learningState.concepts.balance.unaided, 1,
    'an independent solution is tracked');
assert(core.conceptMastery(learningState.concepts.balance) > 0,
    'practice raises confidence-aware mastery');
const hintedLearning = core.updateLearningState(learningState, 'multiplication', {
    solved: true, hints: 1, attempts: 1, durationMs: 4000
});
assert.strictEqual(hintedLearning.concepts.multiplication.unaided, 0,
    'hinted solutions do not count as independent mastery');
for (const concept of Object.values(core.LEARNING_CONCEPTS)) {
    const profile = core.DIFFICULTIES[concept.profile];
    const problem = core.generateProblem({
        profile: profile,
        operations: concept.operations,
        length: concept.length,
        random: core.createSeededRandom('learn:' + concept.id)
    });
    assert.strictEqual(core.learningConceptFor(problem.sides), concept.id,
        concept.id + ' practice generates the intended concept');
    assert.strictEqual(problem.analysis.unique, true,
        concept.id + ' practice has one safe answer');
}

const allOperations = new Set();
for (let seed = 1; seed <= 100; seed++) {
    const problem = core.generateProblem({
        profile: core.DIFFICULTIES.extreme,
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

const initialAdaptive = core.normalizeAdaptiveState(null);
assert.strictEqual(initialAdaptive.rating, core.ADAPTIVE_INITIAL_RATING);
assert.strictEqual(core.adaptiveProfile(initialAdaptive).id, 'normal',
    'Adaptive mode starts at Normal');
const correctAdaptive = core.updateAdaptiveState(initialAdaptive, 'correct', ['add']);
assert(correctAdaptive.rating > initialAdaptive.rating, 'a correct answer raises Adaptive difficulty');
assert(correctAdaptive.operations.add > initialAdaptive.operations.add,
    'a correct answer raises comfort for operators in the question');
const wrongAdaptive = core.updateAdaptiveState(correctAdaptive, 'wrong', ['add']);
assert(wrongAdaptive.rating < correctAdaptive.rating, 'a wrong answer lowers Adaptive difficulty');
const hintedAdaptive = core.updateAdaptiveState(correctAdaptive, 'hint', ['add']);
assert(hintedAdaptive.rating < correctAdaptive.rating, 'a hint applies an Adaptive penalty');
const skippedAdaptive = core.updateAdaptiveState(correctAdaptive, 'skip', ['add']);
assert(skippedAdaptive.rating < hintedAdaptive.rating, 'skipping applies a larger Adaptive penalty');

const comfortable = core.normalizeAdaptiveState({
    rating: 0.55,
    operations: { add: 0.95, subtract: 0.05, multiply: 0.05, divide: 0.05 }
});
const adaptiveProfile = core.adaptiveProfile(comfortable);
const adaptiveWeights = core.adaptiveOperationWeights(comfortable, adaptiveProfile);
let addQuestions = 0;
let subtractQuestions = 0;
for (let seed = 1; seed <= 200; seed++) {
    const problem = core.generateProblem({
        profile: adaptiveProfile,
        operationWeights: adaptiveWeights,
        round: seed,
        random: seededRandom(seed * 997)
    });
    const operations = core.solutionDetails(problem.sides, {}).operations;
    if (operations.includes('add')) addQuestions++;
    if (operations.includes('subtract')) subtractQuestions++;
}
assert(addQuestions > subtractQuestions * 1.5,
    'operators with lower comfort appear substantially less often');
const coachWeights = core.adaptiveOperationWeights(comfortable, adaptiveProfile, 'coach');
assert(coachWeights.subtract > coachWeights.add,
    'Coach strategy emphasizes less-comfortable operators');

for (const rating of [0, 0.2, 0.4, 0.6, 0.8, 1]) {
    const model = core.normalizeAdaptiveState({ rating: rating });
    const profile = core.adaptiveProfile(model);
    for (let seed = 1; seed <= 40; seed++) {
        const problem = core.generateProblem({
            profile: profile,
            operationWeights: core.adaptiveOperationWeights(model, profile),
            round: seed,
            random: seededRandom(seed * 1237 + rating * 100)
        });
        const solution = core.solutionDetails(problem.sides, {});
        assert.strictEqual(solution.solvedTotals[0], solution.solvedTotals[1],
            'Adaptive rating ' + rating + ' produces a solvable question');
    }
}

console.log('Core tests passed for 200 standard puzzles and all operation types.');
