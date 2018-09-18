import * as React from 'react';
import { BaseFormValue, CFormManagedControl, CFormManagedInput } from './formTypes';
import { CSubForm, CSubFormProps, CSubFormState } from './CSubForm';

interface CFormProps<T extends BaseFormValue> extends CSubFormProps<T> {
  // Inherited props:

  // fields?: { [key: string]: FormFieldMetadata }; // Fields metadata
  // autoNext?: boolean; // Auto focus next input in the form on onSubmitEditing event
  // autoSubmitOnLastInput?: boolean; // Auto call obSubmit if the last input got onSubmitEditing event
  // value?: Partial<T>;
  // onChange?: (value: T) => void;
  // disabled?: boolean;

  onSubmit?: (value: T) => void | undefined | Promise<any>;
  submitPromise?: Promise<any> | undefined; // submit promise to disable form while promise is pending
  isValid?: (value: T) => boolean; // Check if value is valid to prevent submit and disable submit button
}

interface CFormState<T extends BaseFormValue> extends CSubFormState<T> {
  isLoading: boolean;
}

/**
 * CForm has guided style and can control focus of it's inputs
 */
export class CForm<T extends BaseFormValue> extends CSubForm<T, CFormProps<T>, CFormState<T>> {
  constructor(props: CFormProps<T>, context: any) {
    super(props, context);
    if (props.submitPromise) {
      this.bindToSubmitPromise(props.submitPromise);
    }
  }

  public get isLoading() {
    return this.state.isLoading;
  }

  componentWillReceiveProps(nextProps: Readonly<CFormProps<T>>, nextContext: any): void {
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
    return <React.Fragment>{this.processChildren(this.props)}</React.Fragment>;
  }

  protected setIsLoading(value: boolean) {
    this.setState({
      isLoading: value,
    });
  }

  protected bindToSubmitPromise = (submitPromise: Promise<void>) => {
    this.setIsLoading(true);
    submitPromise.then(() => this.setIsLoading(false)).catch(() => this.setIsLoading(false));
  };

  protected onLastInputEndEditing() {
    this.onSubmit();
  }

  protected onSubmit = () => {
    const { isValid, onSubmit } = this.props;
    const { value } = this.state;

    let result: Promise<void> | undefined | void = void 0;
    if (onSubmit && !this.isLoading) {
      if (isValid) {
        if (isValid(value)) {
          result = onSubmit(value);
        }
      } else {
        result = onSubmit(value);
      }
    }

    if (result instanceof Promise) {
      this.bindToSubmitPromise(result);
    }
  };

  protected getNewProps(child: React.ReactElement<any>, indexInParent: number) {
    const newProps = super.getNewProps(child, indexInParent);

    const { isValid, disabled } = this.props;

    if (CFormManagedInput.isPrototypeOf(child.type)) {
      newProps.disabled = child.props.disabled || this.isLoading;
    }

    if (CFormManagedControl.isPrototypeOf(child.type)) {
      newProps.isLoading = child.props.isLoading || this.isLoading;

      if (child.props.submit) {
        newProps.onPress = newProps.onClick = (...args: any[]) => {
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
