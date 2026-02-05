"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleEngine = void 0;
class RuleEngine {
    rules;
    constructor(rules) {
        this.rules = rules;
    }
    apply(input) {
        const errors = [];
        for (const rule of this.rules) {
            const err = rule.validate(input);
            if (err)
                errors.push(err);
        }
        return errors;
    }
}
exports.RuleEngine = RuleEngine;
