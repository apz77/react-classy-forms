import * as React from "react";
export interface FormFieldMetadata {
    name: string;
}
export declare function isFormFieldMetadata(arg: any): arg is FormFieldMetadata;
/**
 * ALl inputs in CForm should inherit their props from this interface
 */
export interface FormManagedInputProps<T> {
    field?: FormFieldMetadata | string;
    value?: Partial<T>;
    disabled?: boolean;
    onChange?: (value: T) => void;
    onSubmitEditing?: () => void;
}
/**
 * Any inputs in CForm should extend this class
 */
export declare abstract class CFormManagedInput<T, P extends FormManagedInputProps<T>, S = {}> extends React.Component<P, S> implements IInput {
    focus(): void;
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
export declare abstract class CFormManagedControl<P extends FormManagedControlProps, S = {}> extends React.Component<P, S> {
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
