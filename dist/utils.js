"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isObject(value) {
    const type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
}
exports.isObject = isObject;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
