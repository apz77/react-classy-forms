// This interface mimics FieldMetadata interface to ease fake fields creation
export function isObject(value: any): value is {[key: string]: any} {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
}

export interface FormFieldMetadata {
  name: string;
  types: string[];
  isRequired?: boolean;
}

export function isFormFieldMetadata(arg: any): arg is FormFieldMetadata {
  return isObject(arg) && arg.name && Array.isArray(arg.types) && arg.types.length > 0;
}

/**
 * Common part of all inputs of CForm
 */
export interface FormManagedInputProps<T> {
  field?: FormFieldMetadata;
  value?: T;
  disabled?: boolean;
  onChange?: (value: T) => void;
  onSubmitEditing?: () => void;
}

/**
 * Common parts of all controls pf CForm
 */
export interface FormManagedControlProps {
  submit?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}


/**
 * Inteface of Input Components
 */
export interface IInput {
  focus: () => void;
}
