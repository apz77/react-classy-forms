import * as React from 'react';
import { BaseFormValue, CFormManagedInput, FormFieldMetadata, FormManagedInputProps } from './formTypes';
export interface CSubFormProps<T extends BaseFormValue> extends FormManagedInputProps<T> {
    fields?: {
        [key: string]: FormFieldMetadata;
    } | (keyof T)[];
    autoNext?: boolean;
    autoSubmitOnLastInput?: boolean;
}
export interface CSubFormState<T extends BaseFormValue> {
    value: T;
}
/**
 * CForm has guided loginItemStyle and can control focus of it's inputs
 */
export declare class CSubForm<T extends BaseFormValue, P extends CSubFormProps<T> = CSubFormProps<T>, S extends CSubFormState<T> = CSubFormState<T>> extends CFormManagedInput<T, P, S> {
    protected inputRefs: (CFormManagedInput<any, any> | null)[];
    protected inputIndex: number;
    static defaultProps: {
        autoNext: boolean;
        autoSubmitOnLastInput: boolean;
    };
    constructor(props: P, context: any);
    /**
     * Focus on the first manageable inputs
     */
    focus(): void;
    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void;
    render(): JSX.Element;
    protected getState(props: P): S;
    protected processChildren(props: {
        children?: React.ReactNode;
    }): ({} | null | undefined)[];
    protected getChildren(props: {
        children?: React.ReactNode;
    }): React.ReactNode[];
    protected onChildInputEndEditing(index: number): void;
    protected onLastInputEndEditing(): void;
    protected onChildChange(name: string, fieldValue: any): void;
    protected getNewProps(child: React.ReactElement<any>, indexInParent: number): any;
    protected modifyProps(child: React.ReactElement<any>, indexInParent: number): React.ReactElement<any>;
}
