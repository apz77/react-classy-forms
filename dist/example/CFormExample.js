"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const CForm_1 = require("../CForm");
const CSubForm_1 = require("../CSubForm");
const formTypes_1 = require("../formTypes");
// Declare top form component
class CMyForm extends CForm_1.CForm {
    // This is optional, i just wanna make it styled and react on submit by keyboard
    render() {
        return React.createElement("form", { style: { display: 'table', maxWidth: '400px' } }, super.render());
    }
}
// Declare inner subform to edit one of complicated top fields
class CMySubForm extends CSubForm_1.CSubForm {
}
// The example components itself
class CFormExample extends React.Component {
    constructor() {
        super(...arguments);
        this.isValid = (value) => {
            return Boolean(value.id && value.name && value.complicatedField);
        };
        this.onSubmit = (value) => {
            // Process your submit request here
            console.log('Submitted value:', value);
        };
    }
    render() {
        return (React.createElement(CMyForm, { fields: ['id', 'name', 'complicatedField'], isValid: this.isValid, onSubmit: this.onSubmit },
            React.createElement(CInput, { field: 'id', label: 'Id' }),
            React.createElement(CInput, { field: 'name', label: 'Name' }),
            React.createElement(CMySubForm, { field: 'complicatedField', fields: ['isEnabled', 'name'] },
                React.createElement(CCheckbox, { field: 'isEnabled', label: 'Enable' }),
                React.createElement(CInput, { field: 'name', label: 'Complex field name' })),
            React.createElement(CButton, null),
            React.createElement(CButton, { submit: true })));
    }
}
exports.CFormExample = CFormExample;
// ------------------------ the following code should be part of your components library -----------------------------
// Example of controlled text input
class CInput extends formTypes_1.CFormManagedInput {
    constructor() {
        super(...arguments);
        this.onChange = (e) => {
            const { onChange } = this.props;
            onChange && onChange(e.currentTarget.value);
        };
    }
    render() {
        const { value, disabled, label } = this.props;
        return React.createElement("div", { style: { display: 'table-row' } },
            React.createElement("label", { style: { display: 'table-cell' } }, label),
            React.createElement("input", { style: { display: 'table-cell' }, type: 'text', value: value || '', onChange: this.onChange, disabled: disabled }));
    }
}
// Example of controlled checkbox
class CCheckbox extends formTypes_1.CFormManagedInput {
    constructor() {
        super(...arguments);
        this.onChange = (e) => {
            const { onChange } = this.props;
            onChange && onChange(e.currentTarget.checked);
        };
    }
    render() {
        const { value, disabled, label } = this.props;
        return React.createElement("div", { style: { display: 'table-row' } },
            React.createElement("input", { style: { display: 'table-cell' }, type: 'checkbox', checked: !!value, onChange: this.onChange, disabled: disabled }),
            React.createElement("label", { style: { display: 'table-cell' } }, label));
    }
}
// Example of controlled button
class CButton extends formTypes_1.CFormManagedControl {
    constructor() {
        super(...arguments);
        this.onClick = (e) => {
            const { onClick } = this.props;
            e.preventDefault();
            onClick && onClick();
        };
    }
    render() {
        const { disabled, isLoading, submit } = this.props;
        return (React.createElement("button", { disabled: disabled, onClick: this.onClick }, `${submit ? 'submit' : 'button'} ${isLoading ? '(Loading)' : ''}`));
    }
}
