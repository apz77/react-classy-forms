import * as React from "react";
import { isArray, isObject } from './utils';

/**
 * CForm and CSubForm could manupulate only this data extending this interface
 */
export interface BaseFormData {
  [key: string]: any;
}

/**
 * Form field should be described with using this interface
 */
export interface FormFieldMetadata {
  name: string;
  isRequired?: boolean;
}

export function isFormFieldMetadata(arg: any): arg is FormFieldMetadata {
  return isObject(arg) && arg.name && isArray(arg.types) && arg.types.length > 0;
}

/**
 * Common part of all inputs of CForm
 */
export interface FormManagedInputProps<T> {
  field?: FormFieldMetadata;
  value?: Partial<T>;
  disabled?: boolean;
  onChange?: (value: T) => void;
  onSubmitEditing?: () => void;   // On most inputs that would be pressing Enter key of finishing selection, etc.
}

/**
 * Any CForm managed input should extend this class
 */
export abstract class CFormManagedInput<T, P extends FormManagedInputProps<T>, S = {}>
  extends React.Component<P, S>
  implements IInput {
  focus() {
    console.log(`focus() should be implemented for ${this.constructor.name}`);
  }
}


/**
 * Common parts of all controls of CForm
 */
export interface FormManagedControlProps {
  submit?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}


/**
 * Any CForm managed control (like a button) should extend this class
 */
export abstract class CFormManagedControl<P extends FormManagedControlProps, S = {}> extends React.Component<P, S> {
}

/**
 * Inteface of Input Components
 */
export interface IInput {
  focus: () => void;
}
