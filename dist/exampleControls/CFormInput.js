"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const formTypes_1 = require("../formTypes");
/**
 * This is example of form controllable input, able to edit a string
 */
class CFormInput extends formTypes_1.CFormManagedInput {
    constructor() {
        super(...arguments);
        this.ref = null;
        this.onRef = (ref) => this.ref = ref;
        this.onChange = (event) => {
            const { onChange } = this.props;
            onChange && this.ref && onChange(this.ref.value);
        };
        this.onKeyPress = (event) => {
            // Submit edit on Enter key
            if (event.which === 13 || event.keyCode === 13) {
                const { onSubmitEditing } = this.props;
                if (onSubmitEditing) {
                    event.preventDefault();
                    onSubmitEditing();
                }
            }
        };
    }
    focus() {
        this.ref && this.ref.focus();
    }
    render() {
        const { value, className, style } = this.props;
        return React.createElement("input", { value: value, onChange: this.onChange, onKeyPress: this.onKeyPress, ref: this.onRef, className: className, style: style });
    }
}
exports.CFormInput = CFormInput;
