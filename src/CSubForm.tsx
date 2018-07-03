import * as React from 'react';
import {
  FormFieldMetadata,
  FormManagedInputProps,
  isFormFieldMetadata,
  IInput,
  CFormManagedInput,
  BaseFormData,
} from './formTypes';
import { isArray, isObject } from './utils';

interface CBaseFormProps<T extends BaseFormData> extends FormManagedInputProps<T> {
  fields?: {[key: string]: FormFieldMetadata};  // Fields metadata
  autoNext?: boolean;                  // Auto focus next input in the form on Enter key press
  autoSubmitOnLastInput?: boolean;     // Auto call obSubmit if the last input got Enter key press
  className?: string;
}

/**
 * CForm can control focus of it's inputs
 */
export class CSubForm<T extends BaseFormData, P extends CBaseFormProps<T> = CBaseFormProps<T>, S extends BaseFormData = {}>
  extends CFormManagedInput<T, P, T & S> {

  protected inputRefs: (IInput | null)[] = [];
  protected inputIndex: number = 0;

  static defaultProps = {
    autoNext: true,
    autoSubmitOnLastInput: true,
  };

  constructor(props: P, context: any) {
    super(props, context);
    this.state = this.getState(props);
  }

  /**
   * Focus the first controllable input instanceof CFormManagedInput
   */
  public focus(): void {
    const firstInput = this.inputRefs.length && this.inputRefs[0];
    if (firstInput) {
      firstInput.focus();
    }
  }

  protected getState(props: P): T & S {
    const { fields, value } = props;

    const result: any = {};
    if (fields) {
      for (const fieldName in fields) {
        result[fieldName] = value && (fieldName in value) ? value[fieldName] : void 0;
      }
    }

    return result as T & S;
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    if (nextProps.value !== this.props.value) {
      this.setState(this.getState(nextProps));
    }
  }

  render() {
    this.inputIndex = 0;
    return <div className={this.props.className}>
      {this.processChildren(this.props)}
    </div>;
  }

  protected processChildren(props: {children?: React.ReactNode}) {
    const children = this.getChildren(props);
    return children.map((child, index) => React.isValidElement(child) ? this.modifyProps(child, index) : child);
  }

  protected getChildren(props: {children?: React.ReactNode}): React.ReactNode[] {
    return (isArray(props.children) ? props.children as React.ReactNode[] : [props.children]);
  }

  protected onChildInputEndEditing(index: number) {
    const { autoNext, autoSubmitOnLastInput } = this.props;
    if (autoNext && index < this.inputRefs.length - 1) {
      const nextInput = this.inputRefs[index + 1];
      if (nextInput) {
        nextInput.focus();
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

  protected onChildChange(name: string, value: any) {
    const { onChange } = this.props;
    this.setState({ [name]: value });
    if (onChange) {
      onChange(this.state as any as T);
    }
  }


  protected modifyProps(child: React.ReactElement<any>, indexInParent: number): React.ReactElement<any> {
    return React.cloneElement(child, this.getNewProps(child, indexInParent));
  }

  protected getNewProps(child: React.ReactElement<any>, indexInParent: number): any {
    const { disabled } = this.props;
    const newProps: {[key: string]: any} = {};

    if (isObject(child.type) && ((child.type as any).prototype instanceof CFormManagedInput)) {
      ((inputIndex: number) => {
        newProps.disabled = child.props.disabled || disabled;
        newProps.onSubmitEditing = (...args: any[]) => {
          this.onChildInputEndEditing(inputIndex);
          if (child.props.onSubmitEditing) {
            child.props.onSubmitEditing.call(args);
          }
        };
        newProps.ref = (ref: IInput | null) => {
          this.inputRefs[inputIndex] = ref;
          if (child.props.ref) {
            return child.props.ref.call(ref);
          }
        };
      })(this.inputIndex);

      // Add "value" and "onChange" if we have metadata
      if (isFormFieldMetadata(child.props.field)) {
        if (this.state.hasOwnProperty(child.props.field.name)) {
          newProps.value = this.state[child.props.field.name];
        } else {
          // TODO: Move everything to globbal logger
          console.warn(`An Input component has field metadata, but CForm has no field ${child.props.field.name}`);
        }

        newProps.onChange = (value: any) => {
          this.onChildChange(child.props.field.name, value);
          if (child.props.onChange) {
            child.props.onChange(value);
          }
        };
      }

      this.inputIndex += 1;
    }

    if (!child.key) {
      const { field } = child.props;
      newProps.key = isFormFieldMetadata(field) ? `formKey${field.name}` : `formKey${indexInParent}`;
    }

    // Avoid unneeded recursion
    if (!isObject(child.type) || !((child.type as any).prototype instanceof CFormManagedInput)) {
      newProps.children = this.processChildren(child.props);
    }

    return newProps;
  }
}
