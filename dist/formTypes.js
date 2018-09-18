"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This interface mimics FieldMetadata interface to ease fake fields creation
const React = require("react");
function isFormFieldMetadata(arg) {
    return Object(arg) === arg && arg.name && Array.isArray(arg.types) && arg.types.length > 0;
}
exports.isFormFieldMetadata = isFormFieldMetadata;
/**
 * Any inputs in CForm should extend this class
 */
class CFormManagedInput extends React.Component {
    focus() {
        console.log(`focus() should be implemented for ${this.constructor.name}`);
    }
}
exports.CFormManagedInput = CFormManagedInput;
/**
 * Any CForm managed control (like a button) should extend this class
 */
class CFormManagedControl extends React.Component {
}
exports.CFormManagedControl = CFormManagedControl;
