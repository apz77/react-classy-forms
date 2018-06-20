import * as React from 'react';
import { FormFieldMetadata, isObject } from './formTypes';
import { action, observable } from 'mobx';
import { CFormManagedControl, CFormManagedInput } from './CFormManaged';
import { CSubForm } from './CSubForm';

interface CMainFormProps<T> {
  fields?: {[key: string]: FormFieldMetadata};        // Fields metadata
  value?: T;
  disabled?: boolean;
  onChange?: (value: T) => void;     // Global form onChange
  autoNext?: boolean;                  // Auto focus next input in the form on onSubmitEditing event
  autoSubmitOnLastInput?: boolean;     // Auto call obSubmit if the last input got onSubmitEditing event
  onSubmit?: (value: T) => void | undefined | Promise<void>;
  submitPromise?: Promise<any> | undefined; // submit promise to disable form while promise is pending
  isValid?: (value: T) => boolean;   // Check if value is valid to prevent submit and disable submit button
  className: string;
}

/**
 * CForm can control focus of it's inputs
 */
export class CForm<T> extends CSubForm<T, CMainFormProps<T>> {

  @observable
  private isLoading: boolean;

  constructor(props: CMainFormProps<T>, context: any) {
    super(props, context);
    if (props.submitPromise) {
      this.bindToSubmitPromise(props.submitPromise);
    }
  }

  @action
  protected setIsLoading(value: boolean) {
    this.isLoading = value;
  }

  protected bindToSubmitPromise = (submitPromise: Promise<void>) => {
    this.setIsLoading(true);
    submitPromise
      .then(() => this.setIsLoading(false))
      .catch(() => this.setIsLoading(false));
  }

  componentWillReceiveProps(nextProps: Readonly<CMainFormProps<T>>, nextContext: any): void {
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
    return <form>
        {this.processChildren(this.props)}
    </form>;
  }

  protected onLastInputEndEditing() {
    this.onSubmit();
  }

  protected onSubmit = () => {
    const { isValid, onSubmit } =  this.props;
    let result: Promise<void> | undefined | void = void 0;
    if (onSubmit && !this.isLoading) {
      if (isValid) {
        if (isValid(this.state)) {
          result = onSubmit(this.state);
        }
      } else {
        result = onSubmit(this.state);
      }
    }

    if (result instanceof Promise) {
      this.bindToSubmitPromise(result);
    }
  }

  protected getNewProps(child: React.ReactElement<any>, indexInParent: number) {
    const newProps = super.getNewProps(child, indexInParent);

    const { isValid, disabled } = this.props;

    if (isObject(child.type) && ((child.type as any).prototype instanceof CFormManagedInput)) {
      newProps.disabled = child.props.disabled || this.isLoading;
    }

    if (isObject(child.type) && ((child.type as any).prototype instanceof CFormManagedControl)) {
      newProps.isLoading = child.props.isLoading || this.isLoading;

      if (child.props.submit) {
        newProps.onPress = (...args: any[]) => {
          if (child.props.onPress) {
            child.props.onPress.call(args);
          }
          this.onSubmit();
        };
      }

      if (isValid) {
        const notValid = !isValid(this.state);
        newProps.disabled = child.props.disabled || disabled || notValid;
      }
    }

    return newProps;
  }

}
