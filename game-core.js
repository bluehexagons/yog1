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
            id: 'easy', name: 'Easy', target: 9, length: [2, 4],
            operations: ['add', 'subtract'], maxNumber: 18,
            description: 'Short addition and subtraction with small positive integers.'
        },
        normal: {
            id: 'normal', name: 'Normal', target: 17, length: [3, 6],
            operations: ['add', 'subtract', 'multiply'], maxNumber: 30,
            description: 'Longer expressions that introduce multiplication.'
        },
        hard: {
            id: 'hard', name: 'Hard', target: 27, length: [4, 8],
            operations: ['add', 'subtract', 'multiply', 'divide'], maxNumber: 50,
            description: 'Denser expressions with integer (whole-quotient) division.'
        },
        expert: {
            id: 'expert', name: 'Expert', target: 39, length: [5, 9],
            operations: ['add', 'subtract', 'multiply', 'divide', 'modulo', 'power'], maxNumber: 80,
            description: 'Adds remainders and powers, with larger values.'
        },
        master: {
            id: 'master', name: 'Master', target: 52, length: [6, 11],
            operations: Object.keys(OPERATIONS), maxNumber: 120,
            description: 'Every operation, including roots, in deep expressions.'
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

    function number(value, solution) {
        return { type: 'number', value: value, solution: !!solution };
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
                if (value < 4) {
                    left = randomInt(random, value + 2, Math.min(maxNumber, value + 10));
                    return binary('subtract', number(left), number(left - value));
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
            expandableNodes(expression.value, result);
        } else if (expression.type === 'binary') {
            expandableNodes(expression.left, result);
            expandableNodes(expression.right, result);
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
        candidates = candidates.slice().sort(function () { return random() - 0.5; });
        for (const target of candidates) {
            const shuffled = operations.slice().sort(function () { return random() - 0.5; });
            for (const operation of shuffled) {
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
        let sideIndex = randomInt(random, 0, 1);
        let candidates = solutionNodes(sides[sideIndex]);
        if (!candidates.length) {
            sideIndex = 1 - sideIndex;
            candidates = solutionNodes(sides[sideIndex]);
        }
        if (!candidates.length) {
            sides[sideIndex] = binary('multiply', sides[sideIndex], number(1, true));
            return;
        }
        const target = pick(random, candidates);
        let replacement;
        const identities = operations.filter(function (operation) {
            return ['add', 'subtract', 'multiply', 'divide', 'power'].includes(operation);
        });
        const operation = identities.length ? pick(random, identities) : 'multiply';
        if (operation === 'add' && target.value > 2) {
            replacement = binary('add', number(target.value - 1), number(1, true));
        } else if (operation === 'subtract' || operation === 'add') {
            replacement = binary('subtract', number(target.value + 1), number(1, true));
        } else if (operation === 'divide') {
            replacement = binary('divide', number(target.value), number(1, true));
        } else if (operation === 'power') {
            replacement = binary('power', number(target.value), number(1, true));
        } else {
            replacement = binary('multiply', number(target.value), number(1, true));
        }
        sides[sideIndex] = replaceNode(sides[sideIndex], target, replacement);
    }

    function disguiseOnes(sides, random, maxNumber) {
        let nextId = 0;
        for (const side of sides) {
            visitNumbers(side, function (node) {
                node.id = 'n' + nextId++;
                if (node.value === 1) {
                    node.value = randomInt(random, 5, Math.max(7, maxNumber));
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
        const length = options.length || randomInt(options.random || Math.random, profile.length[0], profile.length[1]);
        return {
            profile: profile,
            random: options.random || Math.random,
            operations: (options.operations || profile.operations).filter(function (op) {
                return Object.prototype.hasOwnProperty.call(OPERATIONS, op);
            }),
            maxNumber: options.maxNumber || profile.maxNumber,
            operationCount: Math.max(2, Math.round(length * scheduled.factor + scheduled.target / 10)),
            scheduled: scheduled
        };
    }

    function generateProblem(options) {
        options = options || {};
        const settings = normalizeOptions(options || {});
        if (!settings.operations.length) {
            throw new Error('Choose at least one operation');
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
        expand(sides, [settings.operations[settings.operations.length - 1]], settings.random, settings.maxNumber);
        while (countOperations(sides[0]) + countOperations(sides[1]) < settings.operationCount && guard-- > 0) {
            expand(sides, settings.operations, settings.random, settings.maxNumber);
        }
        addSolution(sides, settings.operations, settings.random);
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

    return {
        OPERATIONS: OPERATIONS,
        DIFFICULTIES: DIFFICULTIES,
        ROUND_WAVE: ROUND_WAVE,
        clone: clone,
        evaluate: evaluate,
        visitNumbers: visitNumbers,
        countOperations: countOperations,
        difficultyScore: difficultyScore,
        roundTarget: roundTarget,
        generateProblem: generateProblem,
        serialize: serialize
    };
}));
