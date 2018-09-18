"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const formTypes_1 = require("./formTypes");
/**
 * CForm has guided loginItemStyle and can control focus of it's inputs
 */
class CSubForm extends formTypes_1.CFormManagedInput {
    constructor(props, context) {
        super(props, context);
        this.inputRefs = [];
        this.inputIndex = 0;
        this.state = this.getState(props);
    }
    /**
     * Focus on the first manageable inputs
     */
    focus() {
        const firstInput = this.inputRefs.length && this.inputRefs[0];
        if (firstInput) {
            firstInput.focus();
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.value !== this.props.value) {
            this.setState(this.getState(nextProps));
        }
    }
    render() {
        this.inputIndex = 0;
        return React.createElement(React.Fragment, null, this.processChildren(this.props));
    }
    getState(props) {
        const { fields, value } = props;
        const result = {};
        if (fields) {
            for (const fieldKey in fields) {
                const fieldName = formTypes_1.isFormFieldMetadata(fields[fieldKey]) ? fields[fieldKey].name : fields[fieldKey];
                result[fieldName] = value && fieldName in value ? value[fieldName] : void 0;
            }
        }
        return { value: result };
    }
    processChildren(props) {
        const children = this.getChildren(props);
        return children.map((child, index) => (React.isValidElement(child) ? this.modifyProps(child, index) : child));
    }
    getChildren(props) {
        return Array.isArray(props.children) ? props.children : [props.children];
    }
    onChildInputEndEditing(index) {
        const { autoNext, autoSubmitOnLastInput } = this.props;
        if (autoNext && index < this.inputRefs.length - 1) {
            const nextCInput = this.inputRefs[index + 1];
            if (nextCInput && nextCInput.focus) {
                nextCInput.focus();
            }
        }
        if (autoSubmitOnLastInput && index === this.inputRefs.length - 1) {
            this.onLastInputEndEditing();
        }
    }
    onLastInputEndEditing() {
        const { onSubmitEditing } = this.props;
        onSubmitEditing && onSubmitEditing();
    }
    onChildChange(name, fieldValue) {
        const { onChange } = this.props;
        const { value } = this.state;
        value[name] = fieldValue;
        this.setState({ value }, () => {
            if (onChange) {
                onChange(value);
            }
        });
    }
    getNewProps(child, indexInParent) {
        const { disabled } = this.props;
        const newProps = {};
        if (formTypes_1.CFormManagedInput.isPrototypeOf(child.type)) {
            ((inputIndex) => {
                newProps.disabled = child.props.disabled || disabled;
                newProps.onSubmitEditing = (...args) => {
                    this.onChildInputEndEditing(inputIndex);
                    if (child.props.onSubmitEditing) {
                        child.props.onSubmitEditing.call(args);
                    }
                };
                newProps.ref = (ref) => {
                    this.inputRefs[inputIndex] = ref;
                    // TODO: Do we need this?
                    /*if (child.props.ref) {
                     return child.props.ref.call(ref);
                     }*/
                };
            })(this.inputIndex);
            // Add "value" and "onChange" if we have metadata
            if (child.props.field) {
                const { value } = this.state;
                const fieldName = formTypes_1.isFormFieldMetadata(child.props.field) ? child.props.field.name : child.props.field;
                if (value.hasOwnProperty(fieldName)) {
                    newProps.value = value[fieldName];
                }
                else {
                    console.warn(`An CInput has field metadata, but CForm has no field ${fieldName}`);
                }
                newProps.onChange = (value) => {
                    this.onChildChange(fieldName, value);
                    if (child.props.onChange) {
                        child.props.onChange(value);
                    }
                };
            }
            this.inputIndex += 1;
        }
        if (!child.key) {
            newProps.key = `formKey${indexInParent}`;
        }
        // Scan rest of the props for being valid JSX elements
        let propsElementIndex = 0;
        for (const childProp in child.props) {
            if (childProp !== 'children' && React.isValidElement(child.props[childProp])) {
                newProps[childProp] = this.modifyProps(child.props[childProp], propsElementIndex);
                propsElementIndex = propsElementIndex + 1;
            }
        }
        // Avoid unneeded recursion
        if (!formTypes_1.CFormManagedInput.isPrototypeOf(child.type)) {
            newProps.children = this.processChildren(child.props);
        }
        return newProps;
    }
    modifyProps(child, indexInParent) {
        return React.cloneElement(child, this.getNewProps(child, indexInParent));
    }
}
CSubForm.defaultProps = {
    autoNext: true,
    autoSubmitOnLastInput: false,
};
exports.CSubForm = CSubForm;
