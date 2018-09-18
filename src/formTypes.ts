// This interface mimics FieldMetadata interface to ease fake fields creation
import * as React from "react";

export interface FormFieldMetadata {
  name: string;
}

export function isFormFieldMetadata(arg: any): arg is FormFieldMetadata {
  return Object(arg) === arg && arg.name && Array.isArray(arg.types) && arg.types.length > 0;
}

/**
 * ALl inputs in CForm should inherit their props from this interface
 */
export interface FormManagedInputProps<T> {
  field?: FormFieldMetadata | string; // This is used by CSubForm (CForm) to determine field to push to value
  value?: Partial<T>;
  disabled?: boolean;
  onChange?: (value: T) => void;
  onSubmitEditing?: () => void;   // On most inputs that would be pressing Enter key of finishing selection, etc.
}

/**
 * Any inputs in CForm should extend this class
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
  independent?: boolean;
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

export interface BaseFormValue {
  [key: string]: any;
}
