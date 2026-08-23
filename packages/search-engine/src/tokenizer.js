"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = tokenize;
function splitCamelAndSnake(word) {
    return word
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .split(/[_-]/)
        .join(" ")
        .split(" ")
        .filter(Boolean);
}
function tokenize(input) {
    var rawWords = input
        .split(/[^a-zA-Z0-9_-]+/) 
        .filter(Boolean);
    var tokens = new Set();
    for (var _i = 0, rawWords_1 = rawWords; _i < rawWords_1.length; _i++) {
        var word = rawWords_1[_i];
        var lower = word.toLowerCase();
        tokens.add(lower);
        for (var _a = 0, _b = splitCamelAndSnake(word); _a < _b.length; _a++) {
            var piece = _b[_a];
            tokens.add(piece.toLowerCase());
        }
    }
    return __spreadArray([], tokens, true);
}
