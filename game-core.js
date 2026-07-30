(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.Yog1Core = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const OPERATIONS = {
        add: { symbol: '+', label: 'Addition', weight: 1 },
        subtract: { symbol: '−', label: 'Subtraction', weight: 1 },
        multiply: { symbol: '×', label: 'Multiplication', weight: 2 },
        divide: { symbol: '÷', label: 'Integer division', weight: 3 },
        modulo: { symbol: '%', label: 'Remainder (modulus)', weight: 3 },
        power: { symbol: '^', label: 'Powers', weight: 4 },
        root: { symbol: '√', label: 'Square roots', weight: 4 }
    };

    const DIFFICULTIES = {
        easy: {
            id: 'easy', name: 'Easy', target: 6, length: [1, 1], shortRoundChance: 1,
            operations: ['add', 'subtract'], maxNumber: 18,
            description: 'Three-number addition and subtraction with small positive integers.'
        },
        normal: {
            id: 'normal', name: 'Normal', target: 11, length: [2, 4], shortRoundChance: 0.45,
            operations: ['add', 'subtract', 'multiply'], maxNumber: 30,
            description: 'Compact expressions that introduce multiplication, with frequent three-number warm-ups.'
        },
        hard: {
            id: 'hard', name: 'Hard', target: 16, length: [3, 5], shortRoundChance: 0.35,
            operations: ['add', 'subtract', 'multiply', 'divide'], maxNumber: 50,
            description: 'Compact expressions with integer (whole-quotient) division and some three-number rounds.'
        },
        expert: {
            id: 'expert', name: 'Expert', target: 20, length: [3, 6], shortRoundChance: 0.25,
            operations: ['add', 'subtract', 'multiply', 'divide', 'modulo', 'power'], maxNumber: 80,
            description: 'Adds remainders and powers, while retaining occasional three-number rounds.'
        },
        extreme: {
            id: 'extreme', name: 'Extreme', target: 31, length: [4, 8],
            operations: Object.keys(OPERATIONS), maxNumber: 120,
            description: 'Every operation, including roots, in the longest expressions.'
        }
    };

    // This eight-round wave averages exactly 1.0, whether sampled over 24, 32,
    // or 40 rounds. Warm-ups and challenges recur without long difficulty ramps.
    const ROUND_WAVE = [0.7, 0.9, 1, 1.1, 1.3, 0.8, 1, 1.2];
    const ADAPTIVE_INITIAL_RATING = 0.35;
    const LEARNING_CONCEPTS = {
        balance: {
            id: 'balance', operations: ['add', 'subtract'], profile: 'easy', length: 2,
            example: '(a + b) − b = a'
        },
        multiplication: {
            id: 'multiplication', operations: ['add', 'subtract', 'multiply'],
            profile: 'normal', length: 3, example: 'a × 1 = a'
        },
        division: {
            id: 'division', operations: ['add', 'subtract', 'multiply', 'divide'],
            profile: 'hard', length: 3, example: 'a ÷ 1 = a'
        },
        remainder: {
            id: 'remainder', operations: ['add', 'subtract', 'modulo'],
            profile: 'expert', length: 4, example: 'a % b = remainder'
        },
        powers: {
            id: 'powers', operations: ['add', 'subtract', 'multiply', 'power'],
            profile: 'expert', length: 4, example: 'a ^ 1 = a'
        },
        roots: {
            id: 'roots', operations: ['add', 'subtract', 'multiply', 'root'],
            profile: 'extreme', length: 4, example: '√(a × a) = a'
        }
    };

    function randomInt(random, min, max) {
        return Math.floor(random() * (max - min + 1)) + min;
    }

    function pick(random, values) {
        return values[Math.floor(random() * values.length)];
    }

    function shuffle(random, values) {
        const result = values.slice();
        for (let i = result.length - 1; i > 0; i--) {
            const index = randomInt(random, 0, i);
            const value = result[i];
            result[i] = result[index];
            result[index] = value;
        }
        return result;
    }

    function weightedShuffle(random, values, weights) {
        if (!weights) return shuffle(random, values);
        return values.map(function (value) {
            const weight = Math.max(0.01, Number(weights[value]) || 0.01);
            return {
                value: value,
                key: -Math.log(Math.max(Number.EPSILON, random())) / weight
            };
        }).sort(function (left, right) {
            return left.key - right.key;
        }).map(function (item) {
            return item.value;
        });
    }

    function hashSeed(value) {
        let hash = 2166136261;
        const text = String(value);
        for (let i = 0; i < text.length; i++) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function createSeededRandom(seed) {
        let state = hashSeed(seed);
        return function () {
            state += 0x6D2B79F5;
            let value = state;
            value = Math.imul(value ^ value >>> 15, value | 1);
            value ^= value + Math.imul(value ^ value >>> 7, value | 61);
            return ((value ^ value >>> 14) >>> 0) / 4294967296;
        };
    }

    function number(value, solution, decoyValue) {
        const result = { type: 'number', value: value, solution: !!solution };
        if (decoyValue !== undefined) {
            result.decoyValue = decoyValue;
        }
        return result;
    }

    function binary(operation, left, right) {
        return { type: 'binary', operation: operation, left: left, right: right };
    }

    function root(value) {
        return { type: 'root', value: value };
    }

    function clone(expression) {
        return JSON.parse(JSON.stringify(expression));
    }

    function evaluate(expression, values) {
        if (expression.type === 'number') {
            return values && Object.prototype.hasOwnProperty.call(values, expression.id)
                ? values[expression.id]
                : expression.value;
        }
        if (expression.type === 'root') {
            const radicand = evaluate(expression.value, values);
            if (radicand < 0) {
                throw new Error('Root of a negative number');
            }
            return Math.trunc(Math.sqrt(radicand));
        }
        const left = evaluate(expression.left, values);
        const right = evaluate(expression.right, values);
        switch (expression.operation) {
            case 'add': return left + right;
            case 'subtract': return left - right;
            case 'multiply': return left * right;
            case 'divide':
                if (right === 0) {
                    throw new Error('Division by zero');
                }
                return Math.trunc(left / right);
            case 'modulo':
                if (right === 0) {
                    throw new Error('Modulo by zero');
                }
                return left % right;
            case 'power': return Math.pow(left, right);
            default: throw new Error('Unknown operation: ' + expression.operation);
        }
    }

    function visitNumbers(expression, callback) {
        if (expression.type === 'number') {
            callback(expression);
        } else if (expression.type === 'root') {
            visitNumbers(expression.value, callback);
        } else {
            visitNumbers(expression.left, callback);
            visitNumbers(expression.right, callback);
        }
    }

    function countOperations(expression) {
        if (expression.type === 'number') {
            return 0;
        }
        if (expression.type === 'root') {
            return 1 + countOperations(expression.value);
        }
        return 1 + countOperations(expression.left) + countOperations(expression.right);
    }

    function depth(expression) {
        if (expression.type === 'number') {
            return 0;
        }
        if (expression.type === 'root') {
            return 1 + depth(expression.value);
        }
        return 1 + Math.max(depth(expression.left), depth(expression.right));
    }

    function scoreExpression(expression) {
        if (expression.type === 'number') {
            return Math.log2(Math.abs(expression.value) + 1) * 0.35;
        }
        if (expression.type === 'root') {
            return OPERATIONS.root.weight + scoreExpression(expression.value);
        }
        return OPERATIONS[expression.operation].weight +
            scoreExpression(expression.left) + scoreExpression(expression.right);
    }

    function difficultyScore(sides) {
        return Math.round((scoreExpression(sides[0]) + scoreExpression(sides[1]) +
            Math.max(depth(sides[0]), depth(sides[1])) * 1.5) * 10) / 10;
    }

    function perfectPower(value) {
        for (let exponent = 2; exponent <= 5; exponent++) {
            const base = Math.round(Math.pow(value, 1 / exponent));
            if (base >= 2 && Math.pow(base, exponent) === value) {
                return [base, exponent];
            }
        }
        return null;
    }

    function replacementFor(value, operation, random, maxNumber) {
        let left;
        let right;
        switch (operation) {
            case 'add':
                left = randomInt(random, 2, Math.max(2, value - 2));
                if (value <= 4) {
                    return binary('add', number(value), number(0));
                }
                return binary('add', number(left), number(value - left));
            case 'subtract':
                left = randomInt(random, value + 2, Math.max(value + 2, Math.min(maxNumber, value + 18)));
                return binary('subtract', number(left), number(left - value));
            case 'multiply':
                for (let factor = 2; factor <= Math.sqrt(value); factor++) {
                    if (value % factor === 0) {
                        return binary('multiply', number(factor), number(value / factor));
                    }
                }
                return null;
            case 'divide':
                right = randomInt(random, 2, 6);
                return binary('divide', number(value * right), number(right));
            case 'modulo':
                right = randomInt(random, Math.max(2, value + 1), Math.max(value + 2, Math.min(maxNumber, value + 15)));
                left = right * randomInt(random, 2, 5) + value;
                return binary('modulo', number(left), number(right));
            case 'power': {
                const parts = perfectPower(value);
                return parts ? binary('power', number(parts[0]), number(parts[1])) : null;
            }
            case 'root':
                return root(number(value * value));
            default:
                return null;
        }
    }

    function expandableNodes(expression, result) {
        result = result || [];
        if (expression.type === 'number' && expression.value >= 2) {
            result.push(expression);
        } else if (expression.type === 'root') {
            // Keep radicands as single positive integers so any player flip
            // still has a defined integer result.
        } else if (expression.type === 'binary') {
            if (expression.operation !== 'power') {
                expandableNodes(expression.left, result);
            }
            if (!['divide', 'modulo', 'power'].includes(expression.operation)) {
                expandableNodes(expression.right, result);
            }
        }
        return result;
    }

    function solutionNodes(expression, safe, result) {
        result = result || [];
        safe = safe !== false;
        if (expression.type === 'number') {
            if (safe && expression.value >= 2) {
                result.push(expression);
            }
        } else if (expression.type === 'root') {
            solutionNodes(expression.value, false, result);
        } else {
            solutionNodes(expression.left, safe, result);
            const sensitiveRight = expression.operation === 'divide' ||
                expression.operation === 'modulo' || expression.operation === 'power';
            solutionNodes(expression.right, safe && !sensitiveRight, result);
        }
        return result;
    }

    function replaceNode(expression, target, replacement) {
        if (expression === target) {
            return replacement;
        }
        if (expression.type === 'root') {
            expression.value = replaceNode(expression.value, target, replacement);
        } else if (expression.type === 'binary') {
            expression.left = replaceNode(expression.left, target, replacement);
            expression.right = replaceNode(expression.right, target, replacement);
        }
        return expression;
    }

    function expand(sides, operations, random, maxNumber, operationWeights) {
        const sideIndex = randomInt(random, 0, 1);
        let candidates = expandableNodes(sides[sideIndex]);
        if (!candidates.length) {
            candidates = expandableNodes(sides[1 - sideIndex]);
        }
        if (!candidates.length) {
            return false;
        }
        candidates = shuffle(random, candidates);
        for (const target of candidates) {
            const shuffled = weightedShuffle(random, operations, operationWeights);
            for (const operation of shuffled) {
                const hasNonAddIdentity = operations.some(function (candidate) {
                    return ['subtract', 'multiply', 'divide', 'power'].includes(candidate);
                });
                if (operation === 'add' && target.value <= 4 && hasNonAddIdentity) {
                    continue;
                }
                if (operation === 'root') {
                    const solutionCandidates = solutionNodes(sides[0]).concat(solutionNodes(sides[1]));
                    if (solutionCandidates.length <= 1 ||
                        (!hasNonAddIdentity &&
                            solutionCandidates.filter(function (node) { return node.value > 2; }).length <= 1 &&
                            target.value > 2)) {
                        continue;
                    }
                }
                const replacement = replacementFor(target.value, operation, random, maxNumber);
                if (replacement) {
                    sides[sideIndex] = replaceNode(sides[sideIndex], target, replacement);
                    return true;
                }
            }
        }
        return false;
    }

    function addSolution(sides, operations, random, operationWeights) {
        const identities = weightedShuffle(random, operations.filter(function (operation) {
            // A disguised exponent can explode far beyond JavaScript's safe
            // integer range, so the power identity uses a fixed decoy exponent.
            return ['add', 'subtract', 'multiply', 'divide', 'power'].includes(operation);
        }), operationWeights);
        for (const operation of identities) {
            const sideOrder = random() < 0.5 ? [0, 1] : [1, 0];
            for (const sideIndex of sideOrder) {
                const candidates = solutionNodes(sides[sideIndex]).filter(function (node) {
                    return operation !== 'add' || node.value > 2;
                });
                if (!candidates.length) continue;
                const target = pick(random, candidates);
                let replacement;
                if (operation === 'add') {
                    replacement = binary('add', number(target.value - 1), number(1, true));
                } else if (operation === 'subtract') {
                    replacement = binary('subtract', number(target.value + 1), number(1, true));
                } else if (operation === 'divide') {
                    replacement = binary('divide', number(target.value), number(1, true));
                } else if (operation === 'power') {
                    replacement = binary('power', number(target.value), number(1, true, 2));
                } else {
                    replacement = binary('multiply', number(target.value), number(1, true));
                }
                sides[sideIndex] = replaceNode(sides[sideIndex], target, replacement);
                return;
            }
        }
        throw new Error('Unable to place a one-flip solution with the selected operations');
    }

    function disguiseOnes(sides, random, maxNumber) {
        let nextId = 0;
        for (const side of sides) {
            visitNumbers(side, function (node) {
                node.id = 'n' + nextId++;
                if (node.value === 1) {
                    node.value = node.decoyValue === undefined
                        ? randomInt(random, 5, Math.max(7, maxNumber))
                        : node.decoyValue;
                }
            });
        }
    }

    function roundTarget(baseTarget, round) {
        const factor = ROUND_WAVE[(Math.max(1, round) - 1) % ROUND_WAVE.length];
        return {
            target: Math.max(3, Math.round(baseTarget * factor)),
            factor: factor,
            // Round kinds cross the core/UI boundary, so keep them as stable
            // identifiers. Presentation belongs to the localization catalog.
            kind: factor <= 0.8 ? 'warmup' : (factor >= 1.2 ? 'challenge' : 'standard')
        };
    }

    function clampRating(value) {
        return Math.max(0, Math.min(1, Number(value) || 0));
    }

    function normalizeAdaptiveState(state) {
        state = state && typeof state === 'object' ? state : {};
        const operations = {};
        for (const operation of Object.keys(OPERATIONS)) {
            const value = state.operations && state.operations[operation];
            operations[operation] = Number.isFinite(value) ? clampRating(value) : 0.5;
        }
        return {
            rating: Number.isFinite(state.rating)
                ? clampRating(state.rating) : ADAPTIVE_INITIAL_RATING,
            operations: operations
        };
    }

    function adaptiveProfile(state) {
        const rating = normalizeAdaptiveState(state).rating;
        if (rating < 0.2) return DIFFICULTIES.easy;
        if (rating < 0.4) return DIFFICULTIES.normal;
        if (rating < 0.6) return DIFFICULTIES.hard;
        if (rating < 0.8) return DIFFICULTIES.expert;
        return DIFFICULTIES.extreme;
    }

    function adaptiveOperationWeights(state, profile, strategy) {
        const normalized = normalizeAdaptiveState(state);
        const selectedProfile = profile || adaptiveProfile(normalized);
        const result = {};
        for (const operation of selectedProfile.operations) {
            const comfort = normalized.operations[operation];
            // Flow reinforces familiar operations. Coach gives weak operations
            // more practice while preserving a small chance for every operation.
            const emphasis = strategy === 'coach' ? 1 - comfort : comfort;
            result[operation] = 0.1 + Math.pow(emphasis, 2) * 0.9;
        }
        return result;
    }

    function updateAdaptiveState(state, event, operations) {
        const normalized = normalizeAdaptiveState(state);
        const deltas = {
            correct: [0.06, 0.07],
            wrong: [-0.08, -0.1],
            hint: [-0.025, -0.035],
            skip: [-0.15, -0.18]
        };
        const delta = deltas[event];
        if (!delta) return normalized;
        normalized.rating = clampRating(normalized.rating + delta[0]);
        for (const operation of new Set(operations || [])) {
            if (Object.prototype.hasOwnProperty.call(normalized.operations, operation)) {
                normalized.operations[operation] =
                    clampRating(normalized.operations[operation] + delta[1]);
            }
        }
        return normalized;
    }

    function normalizeOptions(options) {
        const profile = options.profile || DIFFICULTIES.normal;
        const round = options.round || 1;
        const scheduled = roundTarget(options.target || profile.target, round);
        if (options.targetRange) {
            const min = Math.min(options.targetRange[0], options.targetRange[1]);
            const max = Math.max(options.targetRange[0], options.targetRange[1]);
            const position = (scheduled.factor - 0.7) / 0.6;
            scheduled.target = Math.round(min + (max - min) * position);
        }
        const random = options.random || Math.random;
        const length = options.length || randomInt(random, profile.length[0], profile.length[1]);
        const shortRound = !options.length && profile.shortRoundChance &&
            random() < profile.shortRoundChance;
        const operationCount = shortRound ? 1 : Math.max(2, Math.round(length * scheduled.factor));
        // A compact identity cannot meaningfully reach the same score as a
        // long expression. Keep the visible target honest for short rounds.
        scheduled.target = Math.min(scheduled.target, 5 + operationCount * 5);
        return {
            profile: profile,
            random: random,
            operations: (options.operations || profile.operations).filter(function (op) {
                return Object.prototype.hasOwnProperty.call(OPERATIONS, op);
            }),
            operationWeights: options.operationWeights || null,
            maxNumber: options.maxNumber || profile.maxNumber,
            // Targets measure arithmetic complexity; they should not also make
            // every high-level expression longer.  A one-operation identity
            // yields exactly three selectable numbers.
            operationCount: operationCount,
            scheduled: scheduled
        };
    }

    function generateCandidate(options) {
        options = options || {};
        const settings = normalizeOptions(options || {});
        if (!settings.operations.length) {
            throw new Error('Choose at least one operation');
        }
        if (!settings.operations.some(function (operation) {
            return ['add', 'subtract', 'multiply', 'divide', 'power'].includes(operation);
        })) {
            throw new Error('Choose an operation that can create a one-flip identity');
        }
        const powerFriendly = settings.operations.indexOf('power') !== -1;
        const multiplyFriendly = settings.operations.indexOf('multiply') !== -1;
        const targets = powerFriendly
            ? [4, 8, 9, 16, 25, 27, 32, 36, 49, 64]
            : (multiplyFriendly ? [4, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 27, 30] : null);
        const targetValue = targets
            ? pick(settings.random, targets.filter(function (value) { return value <= settings.maxNumber; }))
            : randomInt(settings.random, 4, Math.max(6, Math.min(settings.maxNumber, 30)));
        const sides = [number(targetValue), number(targetValue)];
        let guard = settings.operationCount * 4;
        const signatureOperations = settings.operationCount === 1
            ? settings.operations.filter(function (operation) {
                return ['add', 'subtract', 'multiply', 'divide', 'power'].includes(operation);
            })
            : settings.operations;
        const signature = settings.operationWeights
            ? weightedShuffle(settings.random, signatureOperations, settings.operationWeights)[0]
            : signatureOperations[signatureOperations.length - 1];
        // The newest operation in a standard profile is its signature feature.
        // Put it in every generated puzzle instead of leaving its appearance to luck.
        // For three-number rounds, the one-flip identity itself carries that
        // operation, so no preliminary expansion is needed.
        if (settings.operationCount > 1) {
            expand(sides, [signature], settings.random, settings.maxNumber, settings.operationWeights);
        }
        // Reserve one operation for the identity that supplies the solution.
        while (countOperations(sides[0]) + countOperations(sides[1]) < settings.operationCount - 1 && guard-- > 0) {
            expand(sides, settings.operations, settings.random, settings.maxNumber, settings.operationWeights);
        }
        addSolution(sides, settings.operationCount === 1
            ? [signature]
            : settings.operations, settings.random, settings.operationWeights);
        disguiseOnes(sides, settings.random, settings.maxNumber);
        if (evaluate(sides[0]) === evaluate(sides[1]) && (options._attempt || 0) < 30) {
            return generateCandidate(Object.assign({}, options, { _attempt: (options._attempt || 0) + 1 }));
        }
        return {
            sides: sides,
            score: difficultyScore(sides),
            target: settings.scheduled.target,
            roundKind: settings.scheduled.kind,
            factor: settings.scheduled.factor,
            operationCount: countOperations(sides[0]) + countOperations(sides[1])
        };
    }

    function analyzeProblem(sides) {
        const nodes = [];
        sides.forEach(function (side) {
            visitNumbers(side, function (node) { nodes.push(node); });
        });
        const solutions = [];
        for (const node of nodes) {
            const values = { [node.id]: 1 };
            try {
                const totals = sides.map(function (side) { return evaluate(side, values); });
                if (totals.every(Number.isSafeInteger) && totals[0] === totals[1]) {
                    solutions.push({
                        id: node.id,
                        value: node.value,
                        totals: totals
                    });
                }
            } catch (error) {
                // Invalid player flips are reported through safe=false below.
            }
        }
        let safe = true;
        for (const node of nodes) {
            try {
                const values = { [node.id]: 1 };
                if (!sides.every(function (side) {
                    return Number.isSafeInteger(evaluate(side, values));
                })) {
                    safe = false;
                }
            } catch (error) {
                safe = false;
            }
        }
        return {
            solutions: solutions,
            solutionCount: solutions.length,
            unique: solutions.length === 1,
            safe: safe,
            numberCount: nodes.length
        };
    }

    function generateProblem(options) {
        options = options || {};
        const candidateCount = Math.max(1, Math.min(40, options.candidateCount || 12));
        const requireUnique = options.requireUnique !== false;
        let best = null;
        let bestRank = Infinity;
        let intendedOperationCount = null;
        function considerCandidate() {
            const candidate = generateCandidate(options);
            if (intendedOperationCount === null) {
                intendedOperationCount = candidate.operationCount;
            }
            const analysis = analyzeProblem(candidate.sides);
            candidate.analysis = analysis;
            const uniquenessPenalty = requireUnique && !analysis.unique ? 1000 : 0;
            const safetyPenalty = analysis.safe ? 0 : 10000;
            const structurePenalty = candidate.operationCount === intendedOperationCount ? 0 : 100;
            const rank = safetyPenalty + uniquenessPenalty + structurePenalty +
                Math.abs(candidate.score - candidate.target);
            if (rank < bestRank) {
                best = candidate;
                bestRank = rank;
            }
            return rank;
        }
        for (let index = 0; index < candidateCount; index++) {
            if (considerCandidate() === 0) break;
        }
        const acceptable = function (candidate) {
            return candidate && candidate.analysis.safe &&
                (!requireUnique || candidate.analysis.unique);
        };
        // Some operation sets, notably long division-only expressions, produce
        // many accidental 0 = 0 alternatives. Keep searching rather than
        // violating the requireUnique contract when the scoring sample misses.
        for (let index = 0; !acceptable(best) && index < 80; index++) {
            considerCandidate();
        }
        if (!acceptable(best)) {
            throw new Error('Unable to generate a safe puzzle with the requested solution rules');
        }
        return best;
    }

    function serialize(expression, values) {
        if (expression.type === 'number') {
            const value = values && Object.prototype.hasOwnProperty.call(values, expression.id)
                ? values[expression.id] : expression.value;
            return String(value);
        }
        if (expression.type === 'root') {
            return '√(' + serialize(expression.value, values) + ')';
        }
        return '(' + serialize(expression.left, values) + ' ' +
            OPERATIONS[expression.operation].symbol + ' ' +
            serialize(expression.right, values) + ')';
    }

    function evaluationSteps(expression, values, result) {
        result = result || [];
        if (expression.type === 'number') return result;
        if (expression.type === 'root') {
            evaluationSteps(expression.value, values, result);
        } else {
            evaluationSteps(expression.left, values, result);
            evaluationSteps(expression.right, values, result);
        }
        result.push({
            expression: serialize(expression, values),
            value: evaluate(expression, values)
        });
        return result;
    }

    function describe(expression, values, operationLabels) {
        operationLabels = operationLabels || {};
        if (expression.type === 'number') {
            return String(values && Object.prototype.hasOwnProperty.call(values, expression.id)
                ? values[expression.id] : expression.value);
        }
        if (expression.type === 'root') {
            return (operationLabels.root || 'square root of') + ' ' +
                describe(expression.value, values, operationLabels);
        }
        return describe(expression.left, values, operationLabels) + ' ' +
            (operationLabels[expression.operation] || OPERATIONS[expression.operation].label) + ' ' +
            describe(expression.right, values, operationLabels);
    }

    function findNumberContext(expression, id, parentOperation, position) {
        if (expression.type === 'number') {
            return expression.id === id ? {
                id: id,
                value: expression.value,
                operation: parentOperation || null,
                position: position || null
            } : null;
        }
        if (expression.type === 'root') {
            return findNumberContext(expression.value, id, 'root', 'value');
        }
        return findNumberContext(expression.left, id, expression.operation, 'left') ||
            findNumberContext(expression.right, id, expression.operation, 'right');
    }

    function learningConceptFor(sides) {
        const operations = new Set();
        sides.forEach(function (side) {
            (function inspect(expression) {
                if (expression.type === 'root') {
                    operations.add('root');
                    inspect(expression.value);
                } else if (expression.type === 'binary') {
                    operations.add(expression.operation);
                    inspect(expression.left);
                    inspect(expression.right);
                }
            }(side));
        });
        if (operations.has('root')) return 'roots';
        if (operations.has('modulo')) return 'remainder';
        if (operations.has('power')) return 'powers';
        if (operations.has('divide')) return 'division';
        if (operations.has('multiply')) return 'multiplication';
        return 'balance';
    }

    function moveEffect(sides, id) {
        if (!id) return null;
        let context = null;
        let sideIndex = -1;
        for (let index = 0; index < sides.length; index++) {
            context = findNumberContext(sides[index], id);
            if (context) {
                sideIndex = index;
                break;
            }
        }
        if (!context) return null;
        const values = { [id]: 1 };
        const beforeTotals = sides.map(function (side) { return evaluate(side); });
        const afterTotals = sides.map(function (side) { return evaluate(side, values); });
        return {
            id: id,
            number: context.value,
            operation: context.operation,
            position: context.position,
            side: sideIndex,
            beforeTotals: beforeTotals,
            afterTotals: afterTotals,
            before: beforeTotals[sideIndex],
            after: afterTotals[sideIndex],
            delta: afterTotals[sideIndex] - beforeTotals[sideIndex],
            balanced: afterTotals[0] === afterTotals[1]
        };
    }

    function learningAnalysis(sides, moveId) {
        let intendedId = null;
        sides.forEach(function (side) {
            visitNumbers(side, function (node) {
                if (node.solution) intendedId = node.id;
            });
        });
        const beforeTotals = sides.map(function (side) { return evaluate(side); });
        return {
            concept: learningConceptFor(sides),
            beforeTotals: beforeTotals,
            gap: Math.abs(beforeTotals[0] - beforeTotals[1]),
            intendedEffect: moveEffect(sides, intendedId),
            moveEffect: moveEffect(sides, moveId)
        };
    }

    function normalizeLearningState(state) {
        state = state && typeof state === 'object' ? state : {};
        const concepts = {};
        for (const id of Object.keys(LEARNING_CONCEPTS)) {
            const saved = state.concepts && state.concepts[id];
            const seen = saved && Number.isFinite(saved.seen) ? Math.max(0, saved.seen) : 0;
            const solved = saved && Number.isFinite(saved.solved)
                ? Math.min(seen, Math.max(0, saved.solved)) : 0;
            concepts[id] = {
                seen: seen,
                solved: solved,
                unaided: saved && Number.isFinite(saved.unaided)
                    ? Math.min(solved, Math.max(0, saved.unaided)) : 0,
                hints: saved && Number.isFinite(saved.hints) ? Math.max(0, saved.hints) : 0,
                totalMs: saved && Number.isFinite(saved.totalMs) ? Math.max(0, saved.totalMs) : 0
            };
        }
        return { concepts: concepts };
    }

    function conceptProgress(entry) {
        entry = entry || {};
        const seen = Math.max(0, Number(entry.seen) || 0);
        if (!seen) return 0;
        const accuracy = Math.min(1, (Number(entry.solved) || 0) / seen);
        const independence = Math.min(1, (Number(entry.unaided) || 0) / seen);
        const confidence = Math.min(1, seen / 5);
        return Math.round((accuracy * 0.65 + independence * 0.35) * confidence * 100);
    }

    function updateLearningState(state, concept, outcome) {
        const normalized = normalizeLearningState(state);
        if (!Object.prototype.hasOwnProperty.call(normalized.concepts, concept)) return normalized;
        outcome = outcome || {};
        const entry = normalized.concepts[concept];
        entry.seen++;
        entry.hints += Math.max(0, Number(outcome.hints) || 0);
        entry.totalMs += Math.max(0, Number(outcome.durationMs) || 0);
        if (outcome.solved) {
            entry.solved++;
            if (!(Number(outcome.hints) > 0) && !(Number(outcome.attempts) > 1)) {
                entry.unaided++;
            }
        }
        return normalized;
    }

    function recommendedConcept(state) {
        const normalized = normalizeLearningState(state);
        return Object.keys(LEARNING_CONCEPTS).sort(function (left, right) {
            const leftEntry = normalized.concepts[left];
            const rightEntry = normalized.concepts[right];
            return conceptProgress(leftEntry) - conceptProgress(rightEntry) ||
                leftEntry.seen - rightEntry.seen;
        })[0];
    }

    function solutionDetails(sides, currentValues) {
        let solution = null;
        const operations = new Set();
        function inspect(expression) {
            if (expression.type === 'number') {
                if (expression.solution) {
                    solution = expression;
                }
                return;
            }
            if (expression.type === 'root') {
                operations.add('root');
                inspect(expression.value);
                return;
            }
            operations.add(expression.operation);
            inspect(expression.left);
            inspect(expression.right);
        }
        sides.forEach(inspect);
        const solvedValues = solution ? { [solution.id]: 1 } : {};
        return {
            solutionId: solution ? solution.id : null,
            solutionValue: solution ? solution.value : null,
            currentTotals: sides.map(function (side) { return evaluate(side, currentValues); }),
            solvedTotals: sides.map(function (side) { return evaluate(side, solvedValues); }),
            solvedExpression: sides.map(function (side) { return serialize(side, solvedValues); }).join(' = '),
            currentSteps: sides.map(function (side) {
                return evaluationSteps(side, currentValues, []);
            }),
            solvedSteps: sides.map(function (side) {
                return evaluationSteps(side, solvedValues, []);
            }),
            operations: Array.from(operations)
        };
    }

    function learningExample(sides) {
        const details = solutionDetails(sides, {});
        const learning = learningAnalysis(sides, details.solutionId);
        return {
            schemaVersion: 1,
            task: 'change exactly one number to 1 to balance the equation',
            concept: learning.concept,
            puzzle: sides.map(function (side) { return serialize(side); }).join(' = '),
            initialTotals: learning.beforeTotals,
            gap: learning.gap,
            solution: {
                numberId: details.solutionId,
                number: details.solutionValue,
                equation: details.solvedExpression,
                total: details.solvedTotals[0],
                effect: learning.intendedEffect,
                steps: details.solvedSteps
            }
        };
    }

    return {
        OPERATIONS: OPERATIONS,
        DIFFICULTIES: DIFFICULTIES,
        ROUND_WAVE: ROUND_WAVE,
        ADAPTIVE_INITIAL_RATING: ADAPTIVE_INITIAL_RATING,
        LEARNING_CONCEPTS: LEARNING_CONCEPTS,
        hashSeed: hashSeed,
        createSeededRandom: createSeededRandom,
        clone: clone,
        evaluate: evaluate,
        visitNumbers: visitNumbers,
        countOperations: countOperations,
        difficultyScore: difficultyScore,
        roundTarget: roundTarget,
        normalizeAdaptiveState: normalizeAdaptiveState,
        adaptiveProfile: adaptiveProfile,
        adaptiveOperationWeights: adaptiveOperationWeights,
        updateAdaptiveState: updateAdaptiveState,
        analyzeProblem: analyzeProblem,
        generateProblem: generateProblem,
        serialize: serialize,
        evaluationSteps: evaluationSteps,
        describe: describe,
        learningConceptFor: learningConceptFor,
        moveEffect: moveEffect,
        learningAnalysis: learningAnalysis,
        normalizeLearningState: normalizeLearningState,
        conceptProgress: conceptProgress,
        updateLearningState: updateLearningState,
        recommendedConcept: recommendedConcept,
        learningExample: learningExample,
        solutionDetails: solutionDetails
    };
}));
