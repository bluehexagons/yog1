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
            id: 'easy', name: 'Easy', target: 9, length: [1, 1], shortRoundChance: 1,
            operations: ['add', 'subtract'], maxNumber: 18,
            description: 'Three-number addition and subtraction with small positive integers.'
        },
        normal: {
            id: 'normal', name: 'Normal', target: 17, length: [2, 4], shortRoundChance: 0.45,
            operations: ['add', 'subtract', 'multiply'], maxNumber: 30,
            description: 'Compact expressions that introduce multiplication, with frequent three-number warm-ups.'
        },
        hard: {
            id: 'hard', name: 'Hard', target: 27, length: [3, 5], shortRoundChance: 0.35,
            operations: ['add', 'subtract', 'multiply', 'divide'], maxNumber: 50,
            description: 'Compact expressions with integer (whole-quotient) division and some three-number rounds.'
        },
        expert: {
            id: 'expert', name: 'Expert', target: 39, length: [3, 6], shortRoundChance: 0.25,
            operations: ['add', 'subtract', 'multiply', 'divide', 'modulo', 'power'], maxNumber: 80,
            description: 'Adds remainders and powers, while retaining occasional three-number rounds.'
        },
        extreme: {
            id: 'extreme', name: 'Extreme', target: 52, length: [4, 8],
            operations: Object.keys(OPERATIONS), maxNumber: 120,
            description: 'Every operation, including roots, in the longest expressions.'
        }
    };

    // This eight-round wave averages exactly 1.0, whether sampled over 24, 32,
    // or 40 rounds. Warm-ups and challenges recur without long difficulty ramps.
    const ROUND_WAVE = [0.7, 0.9, 1, 1.1, 1.3, 0.8, 1, 1.2];

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

    function expand(sides, operations, random, maxNumber) {
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
            const shuffled = shuffle(random, operations);
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

    function addSolution(sides, operations, random) {
        const identities = shuffle(random, operations.filter(function (operation) {
            // A disguised exponent can explode far beyond JavaScript's safe
            // integer range, so the power identity uses a fixed decoy exponent.
            return ['add', 'subtract', 'multiply', 'divide', 'power'].includes(operation);
        }));
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
            kind: factor <= 0.8 ? 'Warm-up' : (factor >= 1.2 ? 'Challenge' : 'Standard')
        };
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
        return {
            profile: profile,
            random: random,
            operations: (options.operations || profile.operations).filter(function (op) {
                return Object.prototype.hasOwnProperty.call(OPERATIONS, op);
            }),
            maxNumber: options.maxNumber || profile.maxNumber,
            // Targets measure arithmetic complexity; they should not also make
            // every high-level expression longer.  A one-operation identity
            // yields exactly three selectable numbers.
            operationCount: shortRound ? 1 : Math.max(2, Math.round(length * scheduled.factor)),
            scheduled: scheduled
        };
    }

    function generateProblem(options) {
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
        // The newest operation in a standard profile is its signature feature.
        // Put it in every generated puzzle instead of leaving its appearance to luck.
        // For three-number rounds, the one-flip identity itself carries that
        // operation, so no preliminary expansion is needed.
        if (settings.operationCount > 1) {
            expand(sides, [settings.operations[settings.operations.length - 1]], settings.random, settings.maxNumber);
        }
        // Reserve one operation for the identity that supplies the solution.
        while (countOperations(sides[0]) + countOperations(sides[1]) < settings.operationCount - 1 && guard-- > 0) {
            expand(sides, settings.operations, settings.random, settings.maxNumber);
        }
        addSolution(sides, settings.operationCount === 1
            ? [settings.operations[settings.operations.length - 1]]
            : settings.operations, settings.random);
        disguiseOnes(sides, settings.random, settings.maxNumber);
        if (evaluate(sides[0]) === evaluate(sides[1]) && (options._attempt || 0) < 30) {
            return generateProblem(Object.assign({}, options, { _attempt: (options._attempt || 0) + 1 }));
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
            operations: Array.from(operations)
        };
    }

    return {
        OPERATIONS: OPERATIONS,
        DIFFICULTIES: DIFFICULTIES,
        ROUND_WAVE: ROUND_WAVE,
        hashSeed: hashSeed,
        createSeededRandom: createSeededRandom,
        clone: clone,
        evaluate: evaluate,
        visitNumbers: visitNumbers,
        countOperations: countOperations,
        difficultyScore: difficultyScore,
        roundTarget: roundTarget,
        generateProblem: generateProblem,
        serialize: serialize,
        solutionDetails: solutionDetails
    };
}));
