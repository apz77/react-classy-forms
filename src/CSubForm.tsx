import * as React from 'react';
import { FormFieldMetadata, FormManagedInputProps, isFormFieldMetadata, IInput } from './formTypes';
import { observer } from 'mobx-react/native';
import { IObservableObject, isObservableObject, observable, set } from 'mobx';
import { CFormManagedInput } from './CFormManaged';
import {BaseModel, isArray, isObject} from 'swagger-ts-types';
import { inject, Log } from 'modelsApi';

interface CBaseFormProps<T extends BaseModel> extends FormManagedInputProps<T> {
  fields?: {[key: string]: FormFieldMetadata};  // Fields metadata
  autoNext?: boolean;                  // Auto focus next input in the form on onSubmitEditing event
  autoSubmitOnLastInput?: boolean;     // Auto call obSubmit if the last input got onSubmitEditing event
  className?: string;
}

/**
 * CForm has guided loginItemStyle and can control focus of it's inputs
 */
@observer
@inject
export class CSubForm<T extends BaseModel, P extends CBaseFormProps<T> = CBaseFormProps<T>>
  extends CFormManagedInput<T, P, T> {

  protected inputRefs: (IInput | null)[] = [];
  protected inputIndex: number = 0;

  @inject
  private log: Log;

  static defaultProps = {
    autoNext: true,
    autoSubmitOnLastInput: false,
  };

  constructor(props: P, context: any) {
    super(props, context);
    this.state = this.getState(props);
  }

  public focus(): void {
    const firstInput = this.inputRefs.length && this.inputRefs[0];
    if (firstInput) {
      firstInput.focus();
    }
  }

  protected getState(props: P): T {
    const { fields, value } = props;

    const result: any = {};
    if (fields) {
      for (const fieldName in fields) {
        result[fieldName] = value && (fieldName in value) ? value[fieldName] : void 0;
      }
    }

    if (isObservableObject(value)) {
      set(value, result);
      return value as (T & IObservableObject);
    }

    return result as T;
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
      const lastInput = this.inputRefs[this.inputRefs.length - 1];
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
      onChange(this.state);
    }
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
          this.log.warning(`An Input component has field metadata, but CForm has no field ${child.props.field.name}`);
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
    if (isObject(child.type) && !((child.type as any).prototype instanceof CFormManagedInput)) {
      newProps.children = this.processChildren(child.props);
    }

    return newProps;
  }

  protected modifyProps(child: React.ReactElement<any>, indexInParent: number): React.ReactElement<any> {
    return React.cloneElement(child, this.getNewProps(child, indexInParent));
  }

}
