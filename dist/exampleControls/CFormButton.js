"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const formTypes_1 = require("../formTypes");
class CFormButton extends formTypes_1.CFormManagedControl {
    constructor() {
        super(...arguments);
        this.onClick = (event) => {
            const { onClick } = this.props;
            onClick && onClick();
        };
    }
    render() {
        const { caption, className, style, disabled, isLoading } = this.props;
        return React.createElement("button", { className: className, style: style, onClick: this.onClick, disabled: disabled || isLoading }, caption);
    }
}
exports.CFormButton = CFormButton;
