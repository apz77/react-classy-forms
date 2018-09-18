import * as React from 'react';
import { CFormManagedInput, FormManagedInputProps } from '../formTypes';
interface CFormInputProps extends FormManagedInputProps<string> {
    className?: string;
    style?: React.CSSProperties;
}
/**
 * This is example of form controllable input, able to edit a string
 */
export declare class CFormInput extends CFormManagedInput<string, CFormInputProps> {
    protected ref: HTMLInputElement | null;
    focus(): void;
    render(): JSX.Element;
    protected onRef: (ref: HTMLInputElement) => HTMLInputElement;
    protected onChange: (event: React.ChangeEvent<Element>) => void;
    protected onKeyPress: (event: React.KeyboardEvent<Element>) => void;
}
export {};
