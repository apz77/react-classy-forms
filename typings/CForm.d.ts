import * as React from 'react';
import { BaseFormValue } from './formTypes';
import { CSubForm, CSubFormProps, CSubFormState } from './CSubForm';
interface CFormProps<T extends BaseFormValue> extends CSubFormProps<T> {
    onSubmit?: (value: T) => void | undefined | Promise<any>;
    submitPromise?: Promise<any> | undefined;
    isValid?: (value: T) => boolean;
    isLoading?: boolean;
}
interface CFormState<T extends BaseFormValue> extends CSubFormState<T> {
    isLoading: boolean;
}
/**
 * CForm has guided style and can control focus of it's inputs
 */
export declare class CForm<T extends BaseFormValue> extends CSubForm<T, CFormProps<T>, CFormState<T>> {
    constructor(props: CFormProps<T>, context: any);
    readonly isLoading: boolean | undefined;
    componentWillReceiveProps(nextProps: Readonly<CFormProps<T>>, nextContext: any): void;
    render(): JSX.Element;
    protected setIsLoading(value: boolean): void;
    protected bindToSubmitPromise: (submitPromise: Promise<void>) => void;
    protected onLastInputEndEditing(): void;
    protected onSubmit: () => void;
    protected getNewProps(child: React.ReactElement<any>, indexInParent: number): any;
}
export {};
