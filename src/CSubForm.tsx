import * as React from 'react';
import {
  BaseFormValue,
  CFormManagedInput,
  FormFieldMetadata,
  FormManagedInputProps,
  isFormFieldMetadata,
} from './formTypes';

export interface CSubFormProps<T extends BaseFormValue> extends FormManagedInputProps<T> {
  fields?: { [key: string]: FormFieldMetadata } | (keyof T)[]; // Fields metadata
  autoNext?: boolean; // Auto focus next input in the form on onSubmitEditing event
  autoSubmitOnLastInput?: boolean; // Auto call obSubmit if the last input got onSubmitEditing event
}

export interface CSubFormState<T extends BaseFormValue> {
  value: T;
}

/**
 * CForm has guided loginItemStyle and can control focus of it's inputs
 */
export class CSubForm<
  T extends BaseFormValue,
  P extends CSubFormProps<T> = CSubFormProps<T>,
  S extends CSubFormState<T> = CSubFormState<T>
> extends CFormManagedInput<T, P, S> {
  protected inputRefs: (CFormManagedInput<any, any> | null)[] = [];
  protected inputIndex: number = 0;

  static defaultProps = {
    autoNext: true,
    autoSubmitOnLastInput: false,
  };

  constructor(props: P, context: any) {
    super(props, context);
    this.state = this.getState(props);
  }

  /**
   * Focus on the first manageable inputs
   */
  public focus(): void {
    const firstInput = this.inputRefs.length && this.inputRefs[0];
    if (firstInput) {
      firstInput.focus();
    }
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    if (nextProps.value !== this.props.value) {
      this.setState(this.getState(nextProps));
    }
  }

  render() {
    this.inputIndex = 0;
    return <React.Fragment>{this.processChildren(this.props)}</React.Fragment>;
  }

  protected getState(props: P): S {
    const { fields, value } = props;

    const result: any = {};
    if (fields) {
      for (const fieldKey in fields) {
        const fieldName = isFormFieldMetadata((fields as any)[fieldKey]) ? (fields as any)[fieldKey].name : (fields as any)[fieldKey];
        result[fieldName] = value && fieldName in value ? value[fieldName] : void 0;
      }
    }

    return { value: result } as S;
  }

  protected processChildren(props: { children?: React.ReactNode }) {
    const children = this.getChildren(props);
    return children.map((child, index) => (React.isValidElement(child) ? this.modifyProps(child, index) : child));
  }

  protected getChildren(props: { children?: React.ReactNode }): React.ReactNode[] {
    return Array.isArray(props.children) ? (props.children as React.ReactNode[]) : [props.children];
  }

  protected onChildInputEndEditing(index: number) {
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

  protected onLastInputEndEditing() {
    const { onSubmitEditing } = this.props;
    onSubmitEditing && onSubmitEditing();
  }

  protected onChildChange(name: string, fieldValue: any) {
    const { onChange } = this.props;
    const { value } = this.state;
    value[name] = fieldValue;
    this.setState({ value }, () => {
      if (onChange) {
        onChange(value);
      }
    });
  }

  protected getNewProps(child: React.ReactElement<any>, indexInParent: number): any {
    const { disabled } = this.props;
    const newProps: { [key: string]: any } = {};

    if (CFormManagedInput.isPrototypeOf(child.type)) {
      ((inputIndex: number) => {
        newProps.disabled = child.props.disabled || disabled;
        newProps.onSubmitEditing = (...args: any[]) => {
          this.onChildInputEndEditing(inputIndex);
          if (child.props.onSubmitEditing) {
            child.props.onSubmitEditing.call(args);
          }
        };
        newProps.ref = (ref: CFormManagedInput<any, any> | null) => {
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
        const fieldName = isFormFieldMetadata(child.props.field) ? child.props.field.name : child.props.field;
        if (value.hasOwnProperty(fieldName)) {
          newProps.value = value[fieldName];
        } else {
          console.warn(`An CInput has field metadata, but CForm has no field ${fieldName}`);
        }

        newProps.onChange = (value: any) => {
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
    if (!CFormManagedInput.isPrototypeOf(child.type)) {
      newProps.children = this.processChildren(child.props);
    }

    return newProps;
  }

  protected modifyProps(child: React.ReactElement<any>, indexInParent: number): React.ReactElement<any> {
    return React.cloneElement(child, this.getNewProps(child, indexInParent));
  }
}
