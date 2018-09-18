"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const formTypes_1 = require("./formTypes");
const CSubForm_1 = require("./CSubForm");
/**
 * CForm has guided style and can control focus of it's inputs
 */
class CForm extends CSubForm_1.CSubForm {
    constructor(props, context) {
        super(props, context);
        this.bindToSubmitPromise = (submitPromise) => {
            this.setIsLoading(true);
            submitPromise.then(() => this.setIsLoading(false)).catch(() => this.setIsLoading(false));
        };
        this.onSubmit = () => {
            const { isValid, onSubmit } = this.props;
            const { value } = this.state;
            let result = void 0;
            if (onSubmit && !this.isLoading) {
                if (isValid) {
                    if (isValid(value)) {
                        result = onSubmit(value);
                    }
                }
                else {
                    result = onSubmit(value);
                }
            }
            if (result instanceof Promise) {
                this.bindToSubmitPromise(result);
            }
        };
        if (props.submitPromise) {
            this.bindToSubmitPromise(props.submitPromise);
        }
    }
    get isLoading() {
        return this.state.isLoading || this.props.isLoading;
    }
    componentWillReceiveProps(nextProps, nextContext) {
        super.componentWillReceiveProps(nextProps, nextContext);
        if (nextProps.submitPromise !== this.props.submitPromise) {
            this.setIsLoading(true);
            if (nextProps.submitPromise) {
                this.bindToSubmitPromise(nextProps.submitPromise);
            }
        }
    }
    render() {
        this.inputIndex = 0;
        return React.createElement(React.Fragment, null, this.processChildren(this.props));
    }
    setIsLoading(value) {
        this.setState({
            isLoading: value,
        });
    }
    onLastInputEndEditing() {
        this.onSubmit();
    }
    getNewProps(child, indexInParent) {
        const newProps = super.getNewProps(child, indexInParent);
        const { isValid, disabled } = this.props;
        if (formTypes_1.CFormManagedInput.isPrototypeOf(child.type)) {
            newProps.disabled = child.props.disabled || this.isLoading;
        }
        if (formTypes_1.CFormManagedControl.isPrototypeOf(child.type)) {
            newProps.isLoading = child.props.isLoading || this.isLoading;
            if (child.props.submit) {
                newProps.onPress = newProps.onClick = (...args) => {
                    if (child.props.onClick) {
                        child.props.onClick.call(args);
                    }
                    if (child.props.onPress) {
                        child.props.onPress.call(args);
                    }
                    this.onSubmit();
                };
            }
            if (isValid) {
                const { value } = this.state;
                const notValid = !isValid(value);
                newProps.disabled = child.props.disabled || disabled || notValid;
            }
        }
        return newProps;
    }
}
exports.CForm = CForm;
