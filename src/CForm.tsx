import * as React from 'react';
import { FormFieldMetadata, CFormManagedControl, CFormManagedInput, BaseFormData } from './formTypes';
import { CSubForm } from './CSubForm';
import { isObject } from './utils';

interface CMainFormProps<T extends BaseFormData> {
  fields?: { [key: string]: FormFieldMetadata }; // Fields metadata
  value?: Partial<T>;
  disabled?: boolean;
  onChange?: (value: T) => void; // Global form onChange
  autoNext?: boolean; // Auto focus next input in the form on onSubmitEditing event
  autoSubmitOnLastInput?: boolean; // Auto call obSubmit if the last input got onSubmitEditing event
  onSubmit?: (value: T) => void | undefined | Promise<any>;
  submitPromise?: Promise<any> | undefined; // submit promise to disable form while promise is pending
  isValid?: (value: T) => boolean; // Check if value is valid to prevent submit and disable submit button
  isLoading?: boolean; // External isLoading control
}

interface CFormState {
  isLoading: boolean;
}

/**
 * CForm has guided loginItemStyle and can control focus of it's inputs
 */
export class CForm<T extends BaseFormData> extends CSubForm<T, CMainFormProps<T>, CFormState> {

  constructor(props: CMainFormProps<T>, context: any) {
    super(props, context);
    if (props.submitPromise) {
      this.bindToSubmitPromise(props.submitPromise);
    }
  }

  componentWillReceiveProps(nextProps: Readonly<CMainFormProps<T>>, nextContext: any): void {
    if (nextProps.value !== this.props.value || nextProps.isLoading !== this.props.isLoading) {
      this.setState(this.getState(nextProps));
    }

    if (nextProps.submitPromise !== this.props.submitPromise) {
      this.setIsLoading(true);

      if (nextProps.submitPromise) {
        this.bindToSubmitPromise(nextProps.submitPromise);
      }
    }
  }

  render() {
    this.inputIndex = 0;
    return <form>{this.processChildren(this.props)}</form>;
  }

  protected getState(props: CMainFormProps<T>): CFormState & T {
    const result = super.getState(props);
    if (props.isLoading !== void 0) {
      result.isLoading = props.isLoading;
    }
    return result;
  }


  protected onLastInputEndEditing() {
    this.onSubmit();
  }

  protected onSubmit = () => {
    const { isValid, onSubmit } = this.props;
    const { isLoading } = this.state;
    let result: Promise<void> | undefined | void = void 0;
    if (onSubmit && !isLoading) {
      const {isLoading, ...tValue} = this.state as CFormState;

      if (isValid) {
        if (isValid(tValue as T)) {
          result = onSubmit(tValue as T);
        }
      } else {
        result = onSubmit(tValue as T);
      }
    }

    if (result instanceof Promise) {
      this.bindToSubmitPromise(result);
    }
  };

  protected getNewProps(child: React.ReactElement<any>, indexInParent: number) {
    const newProps = super.getNewProps(child, indexInParent);
    const { isLoading } = this.state;

    const { isValid, disabled } = this.props;

    if (isObject(child.type) && (child.type as any).prototype instanceof CFormManagedInput) {
      newProps.disabled = child.props.disabled || isLoading;
    }

    if (isObject(child.type) && (child.type as any).prototype instanceof CFormManagedControl) {
      newProps.isLoading = child.props.isLoading || isLoading;

      if (child.props.submit) {
        newProps.onClick = (...args: any[]) => {
          if (child.props.onClick) {
            child.props.onClick.call(args);
          }
          this.onSubmit();
        };
      }

      if (isValid) {
        const {isLoading, ...tValue} = this.state as CFormState;
        const notValid = !isValid(tValue as T);
        newProps.disabled = child.props.disabled || disabled || notValid;
      }
    }

    return newProps;
  }


  protected setIsLoading(value: boolean) {
    this.setState({ isLoading: value });
  }

  protected bindToSubmitPromise = (submitPromise: Promise<void>) => {
    this.setIsLoading(true);
    submitPromise.then(() => this.setIsLoading(false)).catch(() => {
      this.setIsLoading(false);
      this.focus(); // focus the first input
    });
  };
}
